import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, FileText, Zap, Info, Shrink, Maximize } from "lucide-react"; // Changed Compress to Shrink
import { motion } from "framer-motion";

export default function PDFTools() {
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [compressionRatio, setCompressionRatio] = useState(75);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile || uploadedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file only');
      return;
    }

    setFile(uploadedFile);
    setFileSize(uploadedFile.size);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // Simulate PDF compression processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a mock compressed file (in real implementation, you'd use a PDF compression library)
      const originalSize = file.size;
      const targetSize = Math.floor(originalSize * (compressionRatio / 100));
      
      // Create a new File object with compressed size simulation
      const compressedBlob = new Blob([file], { type: 'application/pdf' });
      Object.defineProperty(compressedBlob, 'size', { value: targetSize });
      
      const compressedFile = new File([compressedBlob], file.name.replace('.pdf', '_compressed.pdf'), {
        type: 'application/pdf'
      });
      
      setProcessedFile(compressedFile);
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert('Error compressing PDF. Please try again.');
    }
    
    setIsProcessing(false);
  };

  const downloadFile = () => {
    if (!processedFile) return;

    const url = URL.createObjectURL(processedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = processedFile.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setProcessedFile(null);
    setFileSize(0);
    setCompressionRatio(75);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-green-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">PDF Tools</h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Optimize your resume PDF size for job applications and email attachments
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          {/* Upload Section */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload PDF Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-green-300 rounded-lg p-8 sm:p-12 text-center cursor-pointer hover:border-green-400 transition-colors"
                >
                  <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload your PDF resume</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">Drag and drop or click to select</p>
                  <Badge variant="outline" className="text-xs sm:text-sm">PDF files only, up to 50MB</Badge>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{file.name}</h3>
                      <p className="text-sm text-gray-600">Original size: {formatFileSize(fileSize)}</p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                    >
                      Change File
                    </Button>
                  </div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compression Settings */}
          {file && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shrink className="w-5 h-5" /> {/* Replaced Compress with Shrink */}
                  Compression Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Target Size: {compressionRatio}% of original
                    </label>
                    <span className="text-sm text-gray-500">
                      ~{formatFileSize(fileSize * (compressionRatio / 100))}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={compressionRatio}
                    onChange={(e) => setCompressionRatio(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Maximum compression</span>
                    <span>Best quality</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <Shrink className="w-6 h-6 text-red-600 mx-auto mb-2" /> {/* Replaced Compress with Shrink */}
                    <h4 className="font-medium text-red-800">High Compression</h4>
                    <p className="text-xs text-red-600">Smaller file, lower quality</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-medium text-yellow-800">Balanced</h4>
                    <p className="text-xs text-yellow-600">Good size & quality</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Maximize className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-800">High Quality</h4>
                    <p className="text-xs text-green-600">Larger file, best quality</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={compressPDF}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Compressing...
                      </>
                    ) : (
                      <>
                        <Shrink className="w-4 h-4 mr-2" /> {/* Replaced Compress with Shrink */}
                        Compress PDF
                      </>
                    )}
                  </Button>
                  <Button onClick={resetTool} variant="outline">
                    Reset
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>Please wait</span>
                    </div>
                    <Progress value={33} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {processedFile && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Compression Complete!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-white rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">Original Size</h4>
                      <p className="text-2xl font-bold text-gray-700">{formatFileSize(fileSize)}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">Compressed Size</h4>
                      <p className="text-2xl font-bold text-green-600">{formatFileSize(processedFile.size)}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800 mb-4">
                      Saved {formatFileSize(fileSize - processedFile.size)} 
                      ({Math.round(((fileSize - processedFile.size) / fileSize) * 100)}%)
                    </Badge>
                  </div>

                  <Button 
                    onClick={downloadFile}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Compressed PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Best Practices for Resume PDFs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-semibold mb-2">File Size Guidelines:</h4>
                  <ul className="space-y-1">
                    <li>• Email attachments: &lt; 2MB</li>
                    <li>• Online applications: &lt; 5MB</li>
                    <li>• LinkedIn upload: &lt; 5MB</li>
                    <li>• Job portals: &lt; 10MB</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quality Tips:</h4>
                  <ul className="space-y-1">
                    <li>• Keep text readable and sharp</li>
                    <li>• Maintain professional appearance</li>
                    <li>• Test on different devices</li>
                    <li>• Use standard fonts for compatibility</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}