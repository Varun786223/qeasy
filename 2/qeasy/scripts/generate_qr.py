#!/usr/bin/env python3
"""
QR Code Generator for QEasy
---------------------------
This script generates QR codes for restaurant menu items or tables.
It requires the qrcode library to be installed.

Install with: pip install qrcode pillow
"""

import qrcode
import os
import sys
from datetime import datetime

def generate_qr(url, filename=None):
    """Generate a QR code for the given URL and save it to a file."""
    if not url:
        print("Error: URL cannot be empty")
        return False
    
    # If no filename is provided, create one based on timestamp
    if not filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"QEasy_QR_{timestamp}.png"
    elif not filename.endswith('.png'):
        filename += '.png'
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add data to the QR code
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create an image from the QR code instance
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(os.path.abspath(filename)), exist_ok=True)
    
    # Save the image
    img.save(filename)
    print(f"QR code saved to {filename}")
    return True

def main():
    """Main function to handle command line usage."""
    if len(sys.argv) > 1:
        url = sys.argv[1]
        filename = sys.argv[2] if len(sys.argv) > 2 else None
        generate_qr(url, filename)
    else:
        url = input("Enter your menu link or table URL: ")
        filename = input("Enter filename to save QR code (leave empty for auto-generated name): ")
        if not filename:
            filename = None
        generate_qr(url, filename)

if __name__ == "__main__":
    main() 