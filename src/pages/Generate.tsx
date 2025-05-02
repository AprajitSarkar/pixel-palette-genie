
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useUser } from '@/contexts/UserContext';
import { useAd } from '@/contexts/AdContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, RefreshCw } from 'lucide-react';

interface GenerationOptions {
  prompt: string;
  negativePrompt: string;
  model: string;
  width: number;
  height: number;
  seed: number;
  noWatermark: boolean;
  safeMode: boolean;
}

const defaultOptions: GenerationOptions = {
  prompt: '',
  negativePrompt: 'worst quality, blurry',
  model: 'flux',
  width: 720,
  height: 1280,
  seed: -1,
  noWatermark: false,
  safeMode: true,
};

const Generate = () => {
  const { user, userData, updateUserCredits } = useUser();
  const { showInterstitialAd } = useAd();
  const navigate = useNavigate();
  
  const [options, setOptions] = useState<GenerationOptions>(defaultOptions);
  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageDetails, setImageDetails] = useState<any>(null);
  const [freeGenUsed, setFreeGenUsed] = useState<boolean>(false);

  const models = [
    { value: 'flux', label: 'Flux (General Purpose)', description: 'Suitable for most scenarios' },
    { value: 'FLUX-3D', label: 'FLUX-3D (3D Style)', description: 'Optimized for 3D rendering style' },
    { value: 'FLUX-PRO', label: 'FLUX-PRO (Professional)', description: 'Advanced model for professional quality' },
    { value: 'Flux-realism', label: 'Flux-realism (Realistic)', description: 'Focused on realistic image generation' },
    { value: 'Flux-anime', label: 'Flux-anime (Anime)', description: 'Optimized for anime-style images' },
    { value: 'Flux-cablyai', label: 'Flux-cablyai (Special)', description: 'Special artistic style model' },
    { value: 'turbo', label: 'Turbo (Fast)', description: 'Fast generation model, speed priority' }
  ];

  // Check local storage for free generation status
  useEffect(() => {
    const usedFreeGen = localStorage.getItem('freeGenerationUsed') === 'true';
    setFreeGenUsed(usedFreeGen);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setOptions(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setOptions(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleRandomSeed = () => {
    setOptions(prev => ({
      ...prev,
      seed: Math.floor(Math.random() * 2147483647)
    }));
  };

  const generateImage = async () => {
    if (!options.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    // Check if this is not the first generation and user is not logged in
    if (freeGenUsed && !user) {
      toast.error('Please log in to generate more images');
      navigate('/login');
      return;
    }

    // Check if user has enough credits
    if (user && userData && userData.credits < 10 && freeGenUsed) {
      toast.error('Not enough credits. Visit the Credits page to earn more');
      navigate('/credits');
      return;
    }

    setGenerating(true);

    try {
      // Construct URL
      let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(options.prompt)}`;
      url += `?width=${options.width}&height=${options.height}`;
      url += `&seed=${options.seed === -1 ? Math.floor(Math.random() * 2147483647) : options.seed}`;
      url += `&model=${options.model}`;
      
      if (options.negativePrompt) {
        url += `&negative_prompt=${encodeURIComponent(options.negativePrompt)}`;
      }
      
      if (options.noWatermark) {
        url += '&nologo=true';
      }
      
      if (!options.safeMode) {
        url += '&safe=false';
      }

      // Simulate image generation with a delay (in a real app, this would be a real API call)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setGeneratedImage(url);
      
      const details = {
        prompt: options.prompt,
        model: options.model,
        dimensions: `${options.width}x${options.height}`,
        seed: options.seed === -1 ? 'random' : options.seed,
        negativePrompt: options.negativePrompt || 'None',
        generatedAt: new Date().toLocaleString()
      };
      
      setImageDetails(details);
      
      // If this is the first generation and user is not logged in, mark it as used
      if (!freeGenUsed && !user) {
        localStorage.setItem('freeGenerationUsed', 'true');
        setFreeGenUsed(true);
      } 
      // If user is logged in, deduct credits
      else if (user && userData) {
        await updateUserCredits(-10);
        
        // Random chance to show interstitial ad
        if (Math.random() > 0.5) {
          await showInterstitialAd();
        }
      }
      
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    // For this web demo, open in new tab instead of downloading
    window.open(generatedImage, '_blank');
    toast.success('Image opened in new tab');
  };

  const clearForm = () => {
    setOptions(defaultOptions);
    setGeneratedImage(null);
    setImageDetails(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Generate Image</h1>
        <p className="text-muted-foreground">
          Use the power of AI to create unique images
          {user && userData ? ` (${userData.credits} credits available)` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6 bg-secondary/20 p-6 rounded-lg glass-effect">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium text-accent">
              Prompt
            </label>
            <Textarea
              id="prompt"
              name="prompt"
              value={options.prompt}
              onChange={handleInputChange}
              placeholder="Describe what you want to generate..."
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Provide detailed descriptions for better results. Include style, scene, colors, etc.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="negativePrompt" className="text-sm font-medium text-accent">
              Negative Prompt
            </label>
            <Input
              id="negativePrompt"
              name="negativePrompt"
              value={options.negativePrompt}
              onChange={handleInputChange}
              placeholder="Things to exclude from the image..."
            />
            <p className="text-xs text-muted-foreground">
              Used for excluding unwanted elements, e.g., "blurry, low quality"
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium text-accent">
              Model
            </label>
            <Select 
              value={options.model} 
              onValueChange={(value) => handleSelectChange('model', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {models.find(m => m.value === options.model)?.description || ''}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-medium text-accent">
                Width: {options.width}px
              </label>
              <Input
                id="width"
                name="width"
                type="number"
                min={64}
                max={1920}
                step={8}
                value={options.width}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium text-accent">
                Height: {options.height}px
              </label>
              <Input
                id="height"
                name="height"
                type="number"
                min={64}
                max={1920}
                step={8}
                value={options.height}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="seed" className="text-sm font-medium text-accent">
                Seed
              </label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRandomSeed} 
                className="h-7 text-xs"
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Random
              </Button>
            </div>
            <Input
              id="seed"
              name="seed"
              type="number"
              min={-1}
              max={2147483647}
              value={options.seed}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Use -1 for a random seed. Same seed + prompt produces similar results.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="noWatermark"
                name="noWatermark"
                checked={options.noWatermark}
                onChange={handleCheckboxChange}
                className="rounded border-input bg-transparent"
              />
              <label htmlFor="noWatermark" className="text-sm font-medium cursor-pointer">
                Remove Watermark
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="safeMode"
                name="safeMode"
                checked={options.safeMode}
                onChange={handleCheckboxChange}
                className="rounded border-input bg-transparent"
              />
              <label htmlFor="safeMode" className="text-sm font-medium cursor-pointer">
                Safe Mode (Filter inappropriate content)
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={generateImage} disabled={generating} className="flex-1 glow-effect">
              {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {generating ? 'Generating...' : 'Generate Image'}
            </Button>
            <Button onClick={clearForm} variant="outline" disabled={generating}>
              Clear
            </Button>
          </div>

          {!user && freeGenUsed && (
            <div className="bg-primary/10 p-3 rounded-md border border-primary/20 text-center">
              <p className="text-sm mb-2">
                Login to generate more images
              </p>
              <Button size="sm" onClick={() => navigate('/login')}>
                Login Now
              </Button>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="bg-secondary/20 p-6 rounded-lg glass-effect">
            <h3 className="text-lg font-medium mb-4">Image Preview</h3>
            <div className="aspect-[4/5] bg-background/50 rounded-md flex items-center justify-center overflow-hidden">
              {generating ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Creating your masterpiece...</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="AI generated" 
                  className="max-w-full max-h-full object-contain rounded-md animate-scale-in"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Your image will appear here</p>
                  <p className="text-xs mt-2">Click "Generate Image" to start</p>
                </div>
              )}
            </div>
          </div>

          {imageDetails && (
            <div className="bg-secondary/20 p-4 rounded-lg glass-effect">
              <div className="mb-4">
                <h4 className="font-medium mb-2">Image Details</h4>
                <div className="bg-background/50 p-3 rounded-md text-xs max-h-36 overflow-y-auto scrollbar-hide">
                  {Object.entries(imageDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-border/20 last:border-0">
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span className="font-mono truncate max-w-[200px]">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
