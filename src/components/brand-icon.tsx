import React from 'react';
import { View, Text } from 'react-native';
import {
  Sparkles,
  FolderArchive,
  Play,
  Film,
  Tv,
  Gamepad2,
  Code2,
  Cloud,
  Palette,
} from 'lucide-react-native';

interface BrandIconProps {
  name: string;
  logoType?: string;
  size?: number;
}

export function BrandIcon({ name, logoType, size = 44 }: BrandIconProps) {
  const normalized = (logoType || name.toLowerCase()).trim();

  // Adobe Creative Cloud
  if (normalized.includes('adobe')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#000000', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Text style={{ color: '#F7D267', fontSize: size * 0.55, fontWeight: '900', fontStyle: 'italic' }}>
          A
        </Text>
      </View>
    );
  }

  // Netflix
  if (normalized.includes('netflix')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#000000', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Text style={{ color: '#E50914', fontSize: size * 0.65, fontWeight: '900' }}>
          N
        </Text>
      </View>
    );
  }

  // Spotify
  if (normalized.includes('spotify')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#000000', borderRadius: size * 0.5 }}
        className="items-center justify-center shadow-sm">
        <View className="items-center justify-center">
          <View style={{ width: size * 0.45, height: 2.5, backgroundColor: '#1DB954', borderRadius: 2, marginBottom: 2.5 }} />
          <View style={{ width: size * 0.38, height: 2, backgroundColor: '#1DB954', borderRadius: 2, marginBottom: 2.5 }} />
          <View style={{ width: size * 0.28, height: 2, backgroundColor: '#1DB954', borderRadius: 2 }} />
        </View>
      </View>
    );
  }

  // YouTube / YouTube Premium / YouTube Music
  if (normalized.includes('youtube')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#FF0000', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Play size={size * 0.45} color="#FFFFFF" fill="#FFFFFF" />
      </View>
    );
  }

  // Disney+
  if (normalized.includes('disney')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#113CCF', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Text style={{ color: '#FFFFFF', fontSize: size * 0.55, fontWeight: '900', fontStyle: 'italic' }}>
          D+
        </Text>
      </View>
    );
  }

  // Notion
  if (normalized.includes('notion')) {
    return (
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: '#FFFFFF',
          borderColor: '#000000',
          borderWidth: 1.5,
          borderRadius: size * 0.28,
        }}
        className="items-center justify-center shadow-xs">
        <Text style={{ color: '#000000', fontSize: size * 0.52, fontWeight: '900' }}>
          N
        </Text>
      </View>
    );
  }

  // Figma
  if (normalized.includes('figma')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#1E1E1E', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Palette size={size * 0.5} color="#F24E1E" />
      </View>
    );
  }

  // Canva
  if (normalized.includes('canva')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#00C4CC', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Text style={{ color: '#FFFFFF', fontSize: size * 0.6, fontWeight: '900', fontStyle: 'italic' }}>
          C
        </Text>
      </View>
    );
  }

  // Dropbox
  if (normalized.includes('dropbox')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#0061FF', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <FolderArchive size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  }

  // OpenAI / ChatGPT
  if (normalized.includes('open') || normalized.includes('chatgpt')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#10A37F', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Sparkles size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  }

  // Claude / Anthropic
  if (normalized.includes('claude') || normalized.includes('anthropic')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#D97706', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Sparkles size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  }

  // Apple Music / Apple One / iCloud
  if (normalized.includes('apple') || normalized.includes('icloud')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#000000', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Text style={{ color: '#FFFFFF', fontSize: size * 0.55, fontWeight: '800' }}>
          
        </Text>
      </View>
    );
  }

  // Google One / Google
  if (normalized.includes('google')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#4285F4', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Cloud size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  }

  // GitHub / Copilot
  if (normalized.includes('github') || normalized.includes('copilot')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#24292F', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Code2 size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  }

  // Xbox
  if (normalized.includes('xbox')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#107C10', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Gamepad2 size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  }

  // PlayStation
  if (normalized.includes('playstation') || normalized.includes('ps plus')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#003791', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Gamepad2 size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  }

  // Prime Video
  if (normalized.includes('prime')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#00A8E1', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Tv size={size * 0.5} color="#FFFFFF" />
      </View>
    );
  }

  // HBO Max
  if (normalized.includes('hbo') || normalized.includes('max')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#5822B4', borderRadius: size * 0.35 }}
        className="items-center justify-center shadow-sm">
        <Film size={size * 0.5} color="#FFFFFF" />
      </View>
    );
  }

  // Medium
  if (normalized.includes('medium')) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: '#000000', borderRadius: size * 0.5 }}
        className="items-center justify-center shadow-sm">
        <Text style={{ color: '#FFFFFF', fontSize: size * 0.5, fontWeight: '900', fontFamily: 'serif' }}>
          M
        </Text>
      </View>
    );
  }

  // Generic fallback
  return (
    <View
      style={{ width: size, height: size, backgroundColor: '#1E293B', borderRadius: size * 0.35 }}
      className="items-center justify-center shadow-sm">
      <Text style={{ color: '#FFFFFF', fontSize: size * 0.5, fontWeight: '800' }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
