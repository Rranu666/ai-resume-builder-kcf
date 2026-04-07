
import React, { useState, useRef, useCallback } from "react";
import { UploadFile, InvokeLLM, GenerateImage } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Sparkles, Zap, RotateCcw, Crop, Palette, User, Camera, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import ResumeLoader from "@/components/common/ResumeLoader";

export default function PhotoEditor() {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const response = await UploadFile({ file });
      setImage(response.file_url);
      setEditedImage(response.file_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsProcessing(false);
  };

  const enhanceWithAI = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze this professional headshot photo and provide recommendations for making it more professional for a resume. Consider lighting, background, composition, and overall professional appearance. Provide specific adjustment recommendations.`,
        file_urls: [image],
        response_json_schema: {
          type: "object",
          properties: {
            professional_score: { type: "number", minimum: 0, maximum: 100 },
            recommendations: { type: "array", items: { type: "string" } },
            brightness_adjustment: { type: "number", minimum: 80, maximum: 120 },
            contrast_adjustment: { type: "number", minimum: 80, maximum: 120 },
            background_suggestion: { type: "string" }
          }
        }
      });

      if (response.brightness_adjustment) {
        setBrightness([response.brightness_adjustment]);
      }
      if (response.contrast_adjustment) {
        setContrast([response.contrast_adjustment]);
      }
      
      // Apply the AI recommendations
      applyFilters(response.brightness_adjustment || 100, response.contrast_adjustment || 100, saturation[0]);
      
    } catch (error) {
      console.error("Error enhancing image:", error);
    }
    setIsProcessing(false);
  };

  const applyFilters = useCallback((bright, cont, sat) => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.filter = `brightness(${bright}%) contrast(${cont}%) saturate(${sat}%)`;
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to data URL
      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      setEditedImage(dataURL);
    };
    
    img.crossOrigin = "anonymous";
    img.src = image;
  }, [image, canvasRef]); // Added canvasRef to dependencies

  const generateProfessionalBackground = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    try {
      const response = await GenerateImage({
        prompt: "Professional neutral background for business headshot, soft gradient, clean corporate style, suitable for resume photo, high quality, professional lighting"
      });
      
      // Here you would composite the person onto the new background
      // This would require more complex image processing
      console.log("Generated background:", response.url);
      
    } catch (error) {
      console.error("Error generating background:", error);
    }
    setIsProcessing(false);
  };

  const downloadImage = () => {
    if (!editedImage) return;
    
    const link = document.createElement('a');
    link.download = 'professional-photo.jpg';
    link.href = editedImage;
    link.click();
  };

  const resetFilters = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setEditedImage(image);
  };

  React.useEffect(() => {
    if (image) {
      applyFilters(brightness[0], contrast[0], saturation[0]);
    }
  }, [brightness, contrast, saturation, image, applyFilters]);

  if (isProcessing) {
    return <ResumeLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
            <Camera className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Professional Photo Editor</h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Transform your photos into professional headshots perfect for your resume
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upload & Preview Section */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!image ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-300 rounded-lg p-8 sm:p-12 text-center cursor-pointer hover:border-purple-400 transition-colors"
                  >
                    <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload your photo</h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">Drag and drop or click to select</p>
                    <Badge variant="outline" className="text-xs sm:text-sm">JPG, PNG up to 10MB</Badge>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={editedImage || image} 
                        alt="Professional headshot" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <Button 
                        onClick={downloadImage}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600"
                        disabled={!editedImage}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Enhancement */}
            {image && (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Enhancement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      onClick={enhanceWithAI}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                      disabled={isProcessing}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isProcessing ? "Enhancing..." : "AI Auto-Enhance"}
                    </Button>
                    
                    <Button 
                      onClick={generateProfessionalBackground}
                      variant="outline"
                      className="w-full"
                      disabled={isProcessing}
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Generate Professional Background
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Controls Section */}
          {image && (
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Manual Adjustments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brightness: {brightness[0]}%
                    </label>
                    <Slider
                      value={brightness}
                      onValueChange={setBrightness}
                      min={50}
                      max={150}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contrast: {contrast[0]}%
                    </label>
                    <Slider
                      value={contrast}
                      onValueChange={setContrast}
                      min={50}
                      max={150}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Saturation: {saturation[0]}%
                    </label>
                    <Slider
                      value={saturation}
                      onValueChange={setSaturation}
                      min={0}
                      max={200}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <Button 
                    onClick={resetFilters}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Professional Photo Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• Use good lighting - natural light works best</li>
                    <li>• Keep a neutral, professional background</li>
                    <li>• Dress professionally and maintain good posture</li>
                    <li>• Look directly at the camera with a slight smile</li>
                    <li>• Crop from chest up for best results</li>
                    <li>• Ensure high resolution (at least 300 DPI)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
