import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Camera,
  Upload,
  Calendar,
  User,
  Heart,
  Save,
  Plus,
  X
} from 'lucide-react';
import profile1 from '@/assets/profiles/profile1.jpg';

interface UserProfile {
  name: string;
  bio: string;
  birthday: string;
  age: number;
  gender: string;
  interests: string[];
  photos: string[];
}

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex',
    bio: 'Looking for meaningful connections beyond the surface. Love deep conversations about philosophy, art, and life.',
    birthday: '1995-06-15',
    age: 28,
    gender: 'Non-binary',
    interests: ['Philosophy', 'Art', 'Music', 'Hiking', 'Photography'],
    photos: [profile1],
  });

  const [newInterest, setNewInterest] = useState('');

  const genderOptions = [
    'Woman',
    'Man', 
    'Non-binary',
    'Genderfluid',
    'Agender',
    'Other',
    'Prefer not to say'
  ];

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birth = new Date(birthday);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleBirthdayChange = (value: string) => {
    const age = calculateAge(value);
    setProfile(prev => ({ ...prev, birthday: value, age }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your backend
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfile(prev => ({
          ...prev,
          photos: [result, ...prev.photos.slice(0, 4)] // Keep max 5 photos
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, save to backend
    console.log('Saving profile:', profile);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-mystical">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-heading font-bold">Edit Profile</h1>
          </div>
          
          <Button onClick={handleSave} className="btn-mystical">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Photos */}
          <div className="space-y-6">
            <div className="bg-mystical-card rounded-xl p-6">
              <h3 className="text-xl font-heading font-semibold mb-4">Profile Photos</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Main photo */}
                <div className="col-span-2">
                  <div className="relative">
                    <ProfilePicture
                      src={profile.photos[0]}
                      alt="Main profile photo"
                      fallback="You"
                      isRevealed={true}
                      size="xl"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Additional photos */}
                {profile.photos.slice(1, 5).map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Profile photo ${index + 2}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
                
                {/* Add photo button */}
                {profile.photos.length < 5 && (
                  <label className="w-full h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-mystical-card rounded-xl p-6">
              <h3 className="text-xl font-heading font-semibold mb-4">Interests</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.interests.map((interest) => (
                  <Badge
                    key={interest}
                    className="bg-accent/20 text-accent-foreground hover:bg-accent/30 cursor-pointer"
                    onClick={() => removeInterest(interest)}
                  >
                    {interest}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest..."
                  className="input-mystical"
                  onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                />
                <Button onClick={addInterest} size="sm" className="btn-mystical">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Basic Info */}
          <div className="space-y-6">
            <div className="bg-mystical-card rounded-xl p-6">
              <h3 className="text-xl font-heading font-semibold mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="input-mystical mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="birthday" className="text-foreground">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={profile.birthday}
                    onChange={(e) => handleBirthdayChange(e.target.value)}
                    className="input-mystical mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Age: {profile.age} years old
                  </p>
                </div>

                <div>
                  <Label htmlFor="gender" className="text-foreground">Gender</Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger className="input-mystical mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-mystical-card border-border">
                      {genderOptions.map((option) => (
                        <SelectItem key={option} value={option} className="hover:bg-secondary/50">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-mystical-card rounded-xl p-6">
              <h3 className="text-xl font-heading font-semibold mb-4">About Me</h3>
              
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                className="input-mystical min-h-32 resize-none"
                maxLength={500}
              />
              
              <div className="text-right text-sm text-muted-foreground mt-2">
                {profile.bio.length}/500 characters
              </div>
            </div>

            <div className="bg-mystical-card rounded-xl p-6">
              <h3 className="text-xl font-heading font-semibold mb-4">Share a Post</h3>
              <p className="text-muted-foreground mb-4">
                Create a post to showcase your personality and interests
              </p>
              
              <Button 
                onClick={() => navigate('/create-post')}
                variant="outline"
                className="btn-secondary-mystical w-full"
              >
                <Heart className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;