package com.sismics.util.mime;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

/**
 * Utility to check MIME types.
 *
 * @author jtremeaux
 */
public class MimeTypeUtil {
    /**
     * check for isZip
     * @param header
     * @return boolean
     */
    private static boolean isZip(String header) {
        return header.startsWith("PK");
    }
    /**
     * check for isGif
     * @param header
     * @return boolean
     */
    private static boolean isGif(String header) {
        return header.startsWith("GIF87a") || header.startsWith("GIF89a");
    }
    /**
     * check for isJpeg
     * @param headerBytes
     * @return boolean
     */
    private static boolean isJpeg(byte[] headerBytes) {
        return headerBytes[0] == ((byte) 0xff) && headerBytes[1] == ((byte) 0xd8);
    }
    /**
     * check for isPng
     * @param headerBytes
     * @return boolean
     */
    private static final byte[] PNG_HEADER = {(byte) 0x89, (byte) 0x50, (byte) 0x4e, (byte) 0x47, (byte) 0x0d, (byte) 0x0a, (byte) 0x1a, (byte) 0x0a};

    private static boolean isPng(byte[] headerBytes) {
        if (headerBytes.length != PNG_HEADER.length) {
            return false;
        }
        for (int i = 0; i < headerBytes.length; i++) {
            if (headerBytes[i] != PNG_HEADER[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * check for isIco
     * @param headerBytes
     * @return boolean
     */
    private static boolean isIco(byte[] headerBytes) {
        return headerBytes[0] == ((byte) 0x00) && headerBytes[1] == ((byte) 0x00) && headerBytes[2] == ((byte) 0x01) && headerBytes[3] == ((byte) 0x00);
    }
    /**
     * Try to guess the MIME type of a file by its magic number (header).
     * 
     * @param file File to inspect
     * @return MIME type
     */

    public static String guessMimeType(File file) throws Exception {
        InputStream is = null;
        try {
            is = new FileInputStream(file);
            byte[] headerBytes = new byte[64];
            int readCount = is.read(headerBytes, 0, headerBytes.length);
            if (readCount <= 0) {
                throw new Exception("Cannot read input file");
            }
            String header = new String(headerBytes, "US-ASCII");

            if (isZip(header)) {
                return MimeType.APPLICATION_ZIP;
            }
            if (isGif(header)) {
                return MimeType.IMAGE_GIF;
            }
            if (isJpeg(headerBytes)) {
                return MimeType.IMAGE_JPEG;
            }
            if (isIco(headerBytes)) {
                return MimeType.IMAGE_X_ICON;
            }
            if (isPng(headerBytes)) {
                return MimeType.IMAGE_PNG;
            }
        } finally {
            if (is != null) {
                is.close();
            }
        }
        return null;
    }
}
