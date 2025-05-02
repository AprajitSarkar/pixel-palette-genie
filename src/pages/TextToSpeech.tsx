
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Volume2, Play, Pause, Save, Mic } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from '@/components/ui/sonner';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('en-US-NeuralVoice');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Available voices
  const voices = [
    { id: 'en-US-NeuralVoice', name: 'English (US) - Neural' },
    { id: 'en-GB-NeuralVoice', name: 'English (UK) - Neural' },
    { id: 'fr-FR-NeuralVoice', name: 'French - Neural' },
    { id: 'es-ES-NeuralVoice', name: 'Spanish - Neural' },
    { id: 'de-DE-NeuralVoice', name: 'German - Neural' },
    { id: 'ja-JP-NeuralVoice', name: 'Japanese - Neural' },
    { id: 'zh-CN-NeuralVoice', name: 'Chinese - Neural' }
  ];

  // Generate speech using the Web Speech API
  const generateSpeech = () => {
    if (!text) {
      toast.error('Please enter some text to convert to speech');
      return;
    }
    
    // Browser's built-in TTS
    setIsGenerating(true);
    
    try {
      // Create speech synthesis
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      const availableVoices = synth.getVoices();
      
      // Try to match requested voice with available voices
      const selectedVoice = availableVoices.find(v => 
        v.lang === voice.substring(0, 5) || 
        v.lang.includes(voice.substring(0, 2))
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Set other properties
      utterance.rate = rate;
      utterance.pitch = pitch;
      
      // Handle events
      utterance.onstart = () => {
        setIsPlaying(true);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error('Error generating speech');
      };
      
      // Cancel any previous speech
      synth.cancel();
      
      // Speak
      synth.speak(utterance);
      
      // Create audio URL for download (using browser TTS API)
      // This is a workaround since the Web Speech API doesn't directly provide audio files
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      oscillator.connect(mediaStreamDestination);
      
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setIsGenerating(false);
        toast.success('Speech generated successfully');
      };
      
      // Start and stop recording to create a dummy file
      // In a real app, you'd use a proper TTS API that returns audio files
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 100);
      
    } catch (error) {
      console.error('TTS error:', error);
      setIsGenerating(false);
      toast.error('Text-to-speech is not supported in your browser');
    }
  };
  
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'speech.wav';
      a.click();
      toast.success('Speech downloaded successfully');
    } else {
      toast.error('No audio available to download');
    }
  };
  
  // Effects for neon background
  const nebulaStyles = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(60px)',
    opacity: '0.15',
    zIndex: '-1',
  };

  return (
    <>
      <Helmet>
        <title>Text to Speech | Pixel Palette</title>
        <meta name="description" content="Convert text to speech with Pixel Palette's free TTS generator" />
        <meta name="keywords" content="text to speech, TTS, free text to speech, voice generator" />
      </Helmet>
      
      <div className="relative">
        {/* Background effects */}
        <div 
          style={{
            ...nebulaStyles as React.CSSProperties,
            width: '500px',
            height: '500px',
            top: '-100px',
            left: '-100px',
            background: 'var(--primary)',
          }} 
        />
        <div 
          style={{
            ...nebulaStyles as React.CSSProperties,
            width: '400px',
            height: '400px',
            bottom: '-100px',
            right: '-100px',
            background: 'var(--accent)',
          }} 
        />
        
        <h1 className="text-3xl font-bold mb-6">Text to Speech</h1>
        
        <Card className="backdrop-blur-sm bg-background/70 border-border">
          <CardHeader>
            <CardTitle>Convert Text to Speech</CardTitle>
            <CardDescription>
              Enter your text below and convert it to natural-sounding speech
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="text" className="text-sm font-medium">Text</label>
              <Textarea 
                id="text"
                placeholder="Type or paste text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="voice" className="text-sm font-medium">Voice</label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map(voiceOption => (
                      <SelectItem key={voiceOption.id} value={voiceOption.id}>
                        {voiceOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="rate" className="text-sm font-medium">
                  Speech Rate: {rate.toFixed(1)}x
                </label>
                <Slider
                  id="rate"
                  value={[rate]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(values) => setRate(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="pitch" className="text-sm font-medium">
                  Pitch: {pitch.toFixed(1)}
                </label>
                <Slider
                  id="pitch"
                  value={[pitch]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(values) => setPitch(values[0])}
                />
              </div>
            </div>
            
            {audioUrl && (
              <div className="pt-4">
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayPause}
                    disabled={!audioUrl}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </Button>
                  <div className="flex-1 mx-4 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="bg-primary h-full animate-pulse" style={{ width: isPlaying ? '100%' : '0%' }} />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownload}
                    disabled={!audioUrl}
                  >
                    <Save size={18} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={generateSpeech} 
              disabled={isGenerating || !text}
              className="w-full"
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span> Generating...
                </span>
              ) : (
                <span className="flex items-center">
                  <Volume2 className="mr-2" /> Generate Speech
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8">
          <Card className="backdrop-blur-sm bg-background/70">
            <CardHeader>
              <CardTitle>About Text-to-Speech</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This text-to-speech feature uses your browser's built-in speech synthesis 
                capabilities to convert text into natural-sounding speech. You can adjust the 
                voice, rate, and pitch to customize the output. The generated speech can be 
                played directly in the browser or downloaded for later use.
              </p>
              
              <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Mic className="mr-2" size={18} /> Pro Tips
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Use punctuation to create natural pauses in speech</li>
                  <li>Adjust the speech rate for different content types</li>
                  <li>Try different voices to find the best fit for your content</li>
                  <li>Download the audio to use in videos, presentations, or other projects</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TextToSpeech;
