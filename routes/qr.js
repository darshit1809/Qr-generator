const express = require('express');
const router = express.Router();
const QRCodeLib = require('qrcode');
const QRCodeModel = require('../models/QRCode');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Generate QR Code from URL
router.post('/generate', async (req, res) => {
  try {
    const { url } = req.body;
    console.log('Received URL for QR generation:', url);

    if (!url) {
      console.log('URL is missing in request');
      return res.status(400).json({ 
        success: false, 
        message: 'URL is required' 
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      console.log('Invalid URL format:', url);
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    console.log('Generating QR code for URL:', url);

    // Generate QR code as data URL with error correction
    const qrCodeDataUrl = await QRCodeLib.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      type: 'image/png'
    });

    console.log('QR code generated successfully');

    // Save QR code to database
    const qrCode = new QRCodeModel({
      content: url,
      imageUrl: qrCodeDataUrl,
      type: 'url'
    });

    await qrCode.save();
    console.log('QR code saved to database');

    res.json({
      success: true,
      qrCode: qrCodeDataUrl,
      message: 'QR Code generated successfully'
    });
  } catch (error) {
    console.error('Error in QR code generation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate QR Code',
      error: error.message
    });
  }
});

// Generate QR Code from CSV
router.post('/generate/csv', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No CSV file uploaded'
      });
    }

    const results = [];
    const headers = [];

    // Read and parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('headers', (headerList) => {
          headers.push(...headerList);
        })
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    // Generate QR code for each row
    const qrCodes = await Promise.all(
      results.map(async (row) => {
        const content = JSON.stringify(row);
        const qrCodeDataUrl = await QRCodeLib.toDataURL(content, {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 300,
          type: 'image/png'
        });

        // Save QR code to database
        const qrCode = new QRCodeModel({
          content: content,
          imageUrl: qrCodeDataUrl,
          type: 'csv',
          csvData: results,
          csvHeaders: headers
        });

        await qrCode.save();
        return {
          id: qrCode._id,
          qrCode: qrCodeDataUrl
        };
      })
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      qrCodes: qrCodes,
      message: 'QR Codes generated successfully from CSV'
    });
  } catch (error) {
    console.error('Error generating QR codes from CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR Codes from CSV',
      error: error.message
    });
  }
});

// Get QR Code history
router.get('/history', async (req, res) => {
  try {
    const qrCodes = await QRCodeModel.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({
      success: true,
      qrCodes
    });
  } catch (error) {
    console.error('Error fetching QR code history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch QR code history'
    });
  }
});

module.exports = router; 