import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  X,
  Plus,
  Check,
  Star,
  ExternalLink,
  Sparkles,
  Gift,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {
  useSubscriptionStore,
  formatCurrency,
  SubscriptionItem,
} from '@/store/useSubscriptionStore';
import { BrandIcon } from '@/components/brand-icon';
import { SubscriptionModal } from '@/components/subscription-modal';

interface PlanTier {
  name: string;
  price: number; // in USD base
  billingCycle: 'monthly' | 'yearly';
  features: string;
}

export interface ExploreAppItem {
  id: string;
  name: string;
  category: string;
  basePrice: number; // in USD
  cardColor: string;
  rating: number;
  reviewCount: string;
  trialBadge?: string;
  hasFreeTrial: boolean;
  description: string;
  officialUrl: string;
  features: string[];
  tiers: PlanTier[];
  popularTag?: string;
}

export const EXPLORE_APPS: ExploreAppItem[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Entertainment',
    basePrice: 15.49,
    cardColor: '#FEE2E2',
    rating: 4.8,
    reviewCount: '240M+ users',
    trialBadge: 'No Free Trial',
    hasFreeTrial: false,
    popularTag: 'Most Popular',
    description: 'Stream award-winning movies, TV series, documentaries, and mobile games on any device.',
    officialUrl: 'https://www.netflix.com',
    features: ['Ultra HD 4K available', 'Download on 4 devices', 'Spatial audio support', 'No ads on Standard/Premium'],
    tiers: [
      { name: 'Standard with Ads', price: 6.99, billingCycle: 'monthly', features: '1080p, 2 supported devices' },
      { name: 'Standard', price: 15.49, billingCycle: 'monthly', features: '1080p, ad-free, 2 devices, downloads' },
      { name: 'Premium', price: 22.99, billingCycle: 'monthly', features: '4K HDR, spatial audio, 4 devices' },
    ],
  },
  {
    id: 'chatgpt',
    name: 'OpenAI ChatGPT Plus',
    category: 'AI & Tech',
    basePrice: 20.0,
    cardColor: '#D7F0DC',
    rating: 4.9,
    reviewCount: '180M+ users',
    trialBadge: 'Free Tier Available',
    hasFreeTrial: true,
    popularTag: 'Trending AI',
    description: 'Get access to GPT-4o, Advanced Voice mode, custom GPTs, Canvas, DALL·E 3 image generation, and priority access.',
    officialUrl: 'https://chatgpt.com',
    features: ['GPT-4o unlimited intelligence', 'Advanced Voice Mode', 'Canvas writing & coding workspace', 'DALL·E image generation'],
    tiers: [
      { name: 'Free', price: 0.0, billingCycle: 'monthly', features: 'Standard GPT-4o with rate limits' },
      { name: 'Plus', price: 20.0, billingCycle: 'monthly', features: '5x higher limit, Advanced Voice, Canvas' },
      { name: 'Pro', price: 200.0, billingCycle: 'monthly', features: 'Unlimited o1 reasoning, priority compute' },
    ],
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    category: 'Music',
    basePrice: 5.99,
    cardColor: '#D7F0DC',
    rating: 4.9,
    reviewCount: '600M+ users',
    trialBadge: '1-Month Free',
    hasFreeTrial: true,
    popularTag: 'Best for Music',
    description: 'Play millions of songs, playlists, and podcasts offline and completely ad-free in high fidelity.',
    officialUrl: 'https://www.spotify.com',
    features: ['Ad-free music listening', 'Download to listen offline', 'Play songs in any order', 'High audio quality'],
    tiers: [
      { name: 'Student', price: 2.99, billingCycle: 'monthly', features: '1 verified student account' },
      { name: 'Individual', price: 5.99, billingCycle: 'monthly', features: '1 account, ad-free, offline' },
      { name: 'Duo', price: 7.99, billingCycle: 'monthly', features: '2 accounts living under one roof' },
      { name: 'Family', price: 10.99, billingCycle: 'monthly', features: 'Up to 6 accounts, Spotify Kids' },
    ],
  },
  {
    id: 'disney',
    name: 'Disney+ Hotstar',
    category: 'Entertainment',
    basePrice: 13.99,
    cardColor: '#BFDCF6',
    rating: 4.7,
    reviewCount: '150M+ users',
    trialBadge: '7-Day Free Trial',
    hasFreeTrial: true,
    description: 'The exclusive streaming home of Disney, Pixar, Marvel, Star Wars, National Geographic, and premier Asian dramas.',
    officialUrl: 'https://www.disneyplus.com',
    features: ['Exclusive Marvel & Star Wars series', 'IMAX Enhanced on select titles', 'Up to 4 concurrent streams', 'Unlimited downloads'],
    tiers: [
      { name: 'Basic', price: 7.99, billingCycle: 'monthly', features: 'With ads, 1080p, 1 device' },
      { name: 'Premium Monthly', price: 13.99, billingCycle: 'monthly', features: '4K UHD, HDR10, Dolby Atmos, 4 devices' },
      { name: 'Premium Annual', price: 139.99, billingCycle: 'yearly', features: 'Save 16% on 12 months full access' },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    category: 'Entertainment',
    basePrice: 13.99,
    cardColor: '#FEE2E2',
    rating: 4.9,
    reviewCount: '100M+ users',
    trialBadge: '1-Month Free',
    hasFreeTrial: true,
    popularTag: 'Great Value',
    description: 'Enjoy uninterrupted ad-free YouTube videos, background play while using other apps, and full YouTube Music Premium included.',
    officialUrl: 'https://www.youtube.com/premium',
    features: ['No ads before or during videos', 'Background play on mobile', 'YouTube Music Premium included', 'Offline downloads'],
    tiers: [
      { name: 'Student', price: 7.99, billingCycle: 'monthly', features: '1 student account with music' },
      { name: 'Individual', price: 13.99, billingCycle: 'monthly', features: '1 account, ad-free videos & music' },
      { name: 'Family', price: 22.99, billingCycle: 'monthly', features: 'Up to 5 family members (ages 13+)' },
    ],
  },
  {
    id: 'claude',
    name: 'Claude Pro (Anthropic)',
    category: 'AI & Tech',
    basePrice: 20.0,
    cardColor: '#FEE8D6',
    rating: 4.9,
    reviewCount: 'Top AI Benchmark',
    trialBadge: 'Free Tier Available',
    hasFreeTrial: true,
    description: 'Next-generation AI assistant by Anthropic. Features Claude 3.7 Sonnet with hybrid extended thinking and interactive Artifacts.',
    officialUrl: 'https://claude.ai',
    features: ['5x more usage than free tier', 'Priority access during high-traffic periods', 'Early access to new models', 'Artifacts live previewing'],
    tiers: [
      { name: 'Free', price: 0.0, billingCycle: 'monthly', features: 'Claude 3.5 Haiku & limited Sonnet' },
      { name: 'Pro', price: 20.0, billingCycle: 'monthly', features: 'Claude 3.7 Sonnet, extended thinking, 5x limit' },
      { name: 'Team', price: 30.0, billingCycle: 'monthly', features: 'Collaboration, higher caps, central billing' },
    ],
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    category: 'Design',
    basePrice: 12.99,
    cardColor: '#D8F3DC',
    rating: 4.8,
    reviewCount: '170M+ users',
    trialBadge: '30-Day Free Trial',
    hasFreeTrial: true,
    description: 'Empower your creative process with 100M+ premium stock photos, graphics, videos, Magic AI Studio tools, and Brand Kits.',
    officialUrl: 'https://www.canva.com',
    features: ['Magic Resize & Background Remover', '100M+ premium photos and videos', 'Brand Kit with fonts and logos', '1TB cloud storage'],
    tiers: [
      { name: 'Pro Monthly', price: 12.99, billingCycle: 'monthly', features: '1 person, unlimited premium assets' },
      { name: 'Pro Annual', price: 119.99, billingCycle: 'yearly', features: 'Save $35/yr with upfront annual billing' },
      { name: 'Teams', price: 14.99, billingCycle: 'monthly', features: 'Minimum 3 team members, team workflows' },
    ],
  },
  {
    id: 'figma',
    name: 'Figma Professional',
    category: 'Design',
    basePrice: 15.0,
    cardColor: '#E0E7FF',
    rating: 4.9,
    reviewCount: 'Industry Standard',
    trialBadge: 'Free Starter Tier',
    hasFreeTrial: true,
    description: 'The collaborative interface design tool of choice for tech companies. Wireframe, prototype, design system library, and Dev Mode.',
    officialUrl: 'https://www.figma.com',
    features: ['Unlimited Figma files & version history', 'Shared team design libraries', 'Dev Mode inspection & code snippets', 'Audio and cursor chat'],
    tiers: [
      { name: 'Starter', price: 0.0, billingCycle: 'monthly', features: '3 Figma & 3 FigJam files' },
      { name: 'Professional', price: 15.0, billingCycle: 'monthly', features: 'Unlimited files, shared team libraries' },
      { name: 'Organization', price: 45.0, billingCycle: 'monthly', features: 'Org-wide design systems, SSO' },
    ],
  },
  {
    id: 'notion',
    name: 'Notion Plus',
    category: 'Productivity',
    basePrice: 12.0,
    cardColor: '#EFE8DE',
    rating: 4.8,
    reviewCount: '35M+ users',
    trialBadge: 'Free Tier Available',
    hasFreeTrial: true,
    description: 'The connected workspace where better, faster work happens. Manage projects, roadmaps, notes, wikis, and team databases.',
    officialUrl: 'https://www.notion.so',
    features: ['Unlimited blocks for teams', 'Unlimited file uploads', '30-day page history', 'Invite up to 100 guests'],
    tiers: [
      { name: 'Free', price: 0.0, billingCycle: 'monthly', features: 'Collaborative workspace, 5MB file upload' },
      { name: 'Plus Monthly', price: 12.0, billingCycle: 'monthly', features: 'Unlimited blocks, unlimited file upload' },
      { name: 'Business', price: 18.0, billingCycle: 'monthly', features: 'SAML SSO, private teamspaces, 90-day history' },
    ],
  },
  {
    id: 'apple',
    name: 'Apple One',
    category: 'Entertainment',
    basePrice: 19.95,
    cardColor: '#E2E8F0',
    rating: 4.8,
    reviewCount: 'Apple Ecosystem',
    trialBadge: '1-Month Free',
    hasFreeTrial: true,
    popularTag: 'All-in-One Bundle',
    description: 'Bundle Apple Music, Apple TV+, Apple Arcade, and iCloud+ into one simple monthly subscription with massive savings.',
    officialUrl: 'https://www.apple.com/apple-one/',
    features: ['Apple Music (100M+ songs lossless)', 'Apple TV+ award-winning originals', 'Apple Arcade (200+ games, no ads)', '50GB to 2TB iCloud+ storage'],
    tiers: [
      { name: 'Individual', price: 19.95, billingCycle: 'monthly', features: 'Music, TV+, Arcade, 50GB iCloud+' },
      { name: 'Family', price: 25.95, billingCycle: 'monthly', features: 'Share with up to 5 people, 200GB iCloud+' },
      { name: 'Premier', price: 37.95, billingCycle: 'monthly', features: 'Adds News+, Fitness+, 2TB iCloud+' },
    ],
  },
  {
    id: 'google',
    name: 'Google One',
    category: 'Cloud',
    basePrice: 1.99,
    cardColor: '#BFDCF6',
    rating: 4.8,
    reviewCount: '100M+ subscribers',
    trialBadge: 'Free 15GB Included',
    hasFreeTrial: true,
    popularTag: 'Best Budget',
    description: 'Expanded cloud storage across Google Drive, Gmail, and Google Photos, seamless phone backup, and Gemini AI access.',
    officialUrl: 'https://one.google.com',
    features: ['Shared storage with up to 5 family members', 'Full-resolution Google Photos backup', 'Google Store 10% back on 2TB+', 'Gemini Advanced on AI Premium'],
    tiers: [
      { name: 'Basic (100GB)', price: 1.99, billingCycle: 'monthly', features: '100GB cloud storage, family sharing' },
      { name: 'Standard (200GB)', price: 2.99, billingCycle: 'monthly', features: '200GB cloud storage, extra benefits' },
      { name: 'Premium (2TB)', price: 9.99, billingCycle: 'monthly', features: '2TB storage, Workspace premium features' },
      { name: 'AI Premium (2TB)', price: 19.99, billingCycle: 'monthly', features: 'Gemini Advanced with 1.5 Pro model' },
    ],
  },
  {
    id: 'icloud',
    name: 'Apple iCloud+',
    category: 'Cloud',
    basePrice: 2.99,
    cardColor: '#E0F2FE',
    rating: 4.7,
    reviewCount: 'iOS Native',
    trialBadge: 'Free 5GB Included',
    hasFreeTrial: true,
    description: 'Keep your photos, files, and device backups safe, secure, and up to date automatically across all your Apple devices.',
    officialUrl: 'https://www.apple.com/icloud/',
    features: ['iCloud Private Relay privacy browsing', 'Hide My Email disposable aliases', 'Custom Email Domain', 'HomeKit Secure Video support'],
    tiers: [
      { name: '50GB', price: 0.99, billingCycle: 'monthly', features: '50GB storage, 1 HomeKit camera' },
      { name: '200GB', price: 2.99, billingCycle: 'monthly', features: '200GB storage, 5 HomeKit cameras, family share' },
      { name: '2TB', price: 9.99, billingCycle: 'monthly', features: '2TB storage, unlimited cameras, family share' },
    ],
  },
  {
    id: 'github',
    name: 'GitHub Copilot',
    category: 'Productivity',
    basePrice: 10.0,
    cardColor: '#E2E8F0',
    rating: 4.8,
    reviewCount: '1.3M+ developers',
    trialBadge: '30-Day Free Trial',
    hasFreeTrial: true,
    description: 'The worlds most widely adopted AI developer tool. Turn natural language prompts into code across dozens of languages in VS Code.',
    officialUrl: 'https://github.com/features/copilot',
    features: ['Real-time code completions', 'Copilot Chat in your editor', 'Pull Request summaries', 'Security vulnerability filters'],
    tiers: [
      { name: 'Individual', price: 10.0, billingCycle: 'monthly', features: 'Code completions & in-editor chat' },
      { name: 'Business', price: 19.0, billingCycle: 'monthly', features: 'Org management, policy controls, IP indemnity' },
      { name: 'Enterprise', price: 39.0, billingCycle: 'monthly', features: 'Custom fine-tuning, knowledge bases' },
    ],
  },
  {
    id: 'xbox',
    name: 'Xbox Game Pass',
    category: 'Entertainment',
    basePrice: 14.99,
    cardColor: '#D7F0DC',
    rating: 4.9,
    reviewCount: '34M+ gamers',
    trialBadge: '14-Day Trial for $1',
    hasFreeTrial: true,
    popularTag: 'Gamers Choice',
    description: 'Play hundreds of high-quality console and PC games, brand-new day-one titles, EA Play membership, and cloud gaming on mobile.',
    officialUrl: 'https://www.xbox.com/gamepass',
    features: ['Play brand-new games on day one', 'Hundreds of console & PC titles', 'Cloud Gaming on phones and tablets', 'EA Play membership included'],
    tiers: [
      { name: 'Core', price: 9.99, billingCycle: 'monthly', features: 'Online multiplayer + 25 games' },
      { name: 'PC Game Pass', price: 11.99, billingCycle: 'monthly', features: 'Day-one PC titles + EA Play' },
      { name: 'Ultimate', price: 19.99, billingCycle: 'monthly', features: 'Console + PC + Cloud Gaming + EA Play' },
    ],
  },
  {
    id: 'playstation',
    name: 'PlayStation Plus',
    category: 'Entertainment',
    basePrice: 9.99,
    cardColor: '#BFDCF6',
    rating: 4.7,
    reviewCount: '47M+ players',
    trialBadge: '7-Day Free Trial',
    hasFreeTrial: true,
    description: 'Enhance your PlayStation experience with online multiplayer, monthly games to keep, exclusive PS Store discounts, and game trials.',
    officialUrl: 'https://www.playstation.com/ps-plus/',
    features: ['Monthly games included at no extra cost', 'Online multiplayer access', 'Exclusive PlayStation Store discounts', 'Cloud storage for game saves'],
    tiers: [
      { name: 'Essential', price: 9.99, billingCycle: 'monthly', features: 'Monthly games, online play, discounts' },
      { name: 'Extra', price: 14.99, billingCycle: 'monthly', features: 'Adds Game Catalog with 400+ PS4/PS5 games' },
      { name: 'Deluxe / Premium', price: 17.99, billingCycle: 'monthly', features: 'Adds Classic Catalog, Cloud Streaming, Trials' },
    ],
  },
  {
    id: 'midjourney',
    name: 'Midjourney AI',
    category: 'Design',
    basePrice: 10.0,
    cardColor: '#E2E8F0',
    rating: 4.8,
    reviewCount: 'Creative Standard',
    trialBadge: 'No Free Trial',
    hasFreeTrial: false,
    description: 'State-of-the-art generative AI platform for creating photorealistic art, conceptual illustrations, design mockups, and wallpapers.',
    officialUrl: 'https://www.midjourney.com',
    features: ['Photorealistic image synthesis v6', 'Fast GPU generation hours', 'General commercial terms', 'Access to member gallery'],
    tiers: [
      { name: 'Basic', price: 10.0, billingCycle: 'monthly', features: '3.3 Fast GPU hours/month' },
      { name: 'Standard', price: 30.0, billingCycle: 'monthly', features: '15 Fast GPU hours + unlimited Relax hours' },
      { name: 'Pro', price: 60.0, billingCycle: 'monthly', features: '30 Fast GPU hours + Stealth mode' },
    ],
  },
  {
    id: 'prime',
    name: 'Amazon Prime Video',
    category: 'Entertainment',
    basePrice: 8.99,
    cardColor: '#D8E8F8',
    rating: 4.6,
    reviewCount: '200M+ members',
    trialBadge: '30-Day Free Trial',
    hasFreeTrial: true,
    description: 'Watch blockbuster movies, Amazon Original series, live sports, and enjoy award-winning entertainment across all devices.',
    officialUrl: 'https://www.primevideo.com',
    features: ['Prime Video Originals and Exclusives', '4K UHD HDR with Dolby Vision', 'X-Ray for cast & trivia info', 'Offline downloads on mobile'],
    tiers: [
      { name: 'Prime Video Only', price: 8.99, billingCycle: 'monthly', features: 'Unlimited streaming on 3 screens' },
      { name: 'Full Amazon Prime', price: 14.99, billingCycle: 'monthly', features: 'Video + Free 1-Day Delivery + Prime Music' },
    ],
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    category: 'Design',
    basePrice: 77.49,
    cardColor: '#F7D267',
    rating: 4.7,
    reviewCount: 'Industry Standard',
    trialBadge: '7-Day Free Trial',
    hasFreeTrial: true,
    description: 'The complete creative powerhouse: 20+ desktop and mobile apps including Photoshop, Illustrator, Premiere Pro, InDesign, and Acrobat.',
    officialUrl: 'https://www.adobe.com/creativecloud.html',
    features: ['20+ creative desktop and mobile apps', '100GB cloud storage & asset syncing', 'Adobe Fonts & Adobe Stock access', 'Firefly Generative AI credits'],
    tiers: [
      { name: 'Photography Plan', price: 9.99, billingCycle: 'monthly', features: 'Photoshop + Lightroom + 20GB cloud' },
      { name: 'Single App (e.g. Photoshop)', price: 22.99, billingCycle: 'monthly', features: '1 app + 100GB cloud + Adobe Express' },
      { name: 'All Apps Full Suite', price: 77.49, billingCycle: 'monthly', features: '20+ apps, 100GB cloud, generative credits' },
    ],
  },
];

const EXPLORE_CATEGORIES = [
  'All',
  'Entertainment',
  'AI & Tech',
  'Productivity',
  'Music',
  'Cloud',
  'Design',
];

export default function ExploreScreen() {
  const router = useRouter();
  const { subscriptions, addSubscription, currency } = useSubscriptionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quickFilter, setQuickFilter] = useState<'all' | 'trial' | 'budget'>('all');

  // Modal detail states
  const [selectedApp, setSelectedApp] = useState<ExploreAppItem | null>(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

  // Custom edit modal
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customPrefillData, setCustomPrefillData] = useState<SubscriptionItem | null>(null);

  // Success Toast Banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Set of names already in subscriptions (lowercased)
  const subscribedNamesSet = useMemo(() => {
    return new Set(subscriptions.map((s) => s.name.toLowerCase().trim()));
  }, [subscriptions]);

  const isAlreadySubscribed = (appName: string) => {
    const clean = appName.toLowerCase().trim();
    for (const subName of subscribedNamesSet) {
      if (subName.includes(clean) || clean.includes(subName)) {
        return true;
      }
    }
    return false;
  };

  // Filtered catalog
  const filteredApps = useMemo(() => {
    return EXPLORE_APPS.filter((app) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.features.some((f) => f.toLowerCase().includes(q));

      // Category
      const matchesCategory =
        selectedCategory === 'All' || app.category.toLowerCase() === selectedCategory.toLowerCase();

      // Quick filter
      let matchesQuick = true;
      if (quickFilter === 'trial') {
        matchesQuick = app.hasFreeTrial;
      } else if (quickFilter === 'budget') {
        matchesQuick = app.basePrice <= 10.0;
      }

      return matchesSearch && matchesCategory && matchesQuick;
    });
  }, [searchQuery, selectedCategory, quickFilter]);

  const showToast = (appName: string) => {
    setToastMessage(`Added "${appName}" to your subscriptions!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // One-click quick add from app card
  const handleQuickAdd = async (app: ExploreAppItem) => {
    const defaultTier = app.tiers[0] || {
      name: 'Standard',
      price: app.basePrice,
      billingCycle: 'monthly',
      features: '',
    };

    const newSubInput = {
      name: app.name,
      price: defaultTier.price,
      currency: 'USD',
      category: app.category,
      billingCycle: defaultTier.billingCycle,
      renewalDate: '2026-12-18',
      remindDaysBefore: 3,
      paymentMethod: 'Visa •••• 4242',
      cardColor: app.cardColor,
      iconColor: '#0f172a',
      notes: `${defaultTier.name} plan • Added from Explore Catalog`,
      isActive: true,
    };

    await addSubscription(newSubInput);
    showToast(app.name);
  };

  // Add from Details Modal with chosen tier
  const handleAddFromModal = async () => {
    if (!selectedApp) return;
    const chosenTier = selectedApp.tiers[selectedTierIndex] || selectedApp.tiers[0];

    const newSubInput = {
      name: selectedApp.name,
      price: chosenTier.price,
      currency: 'USD',
      category: selectedApp.category,
      billingCycle: chosenTier.billingCycle,
      renewalDate: '2026-12-18',
      remindDaysBefore: 3,
      paymentMethod: 'Visa •••• 4242',
      cardColor: selectedApp.cardColor,
      iconColor: '#0f172a',
      notes: `${chosenTier.name} plan (${chosenTier.features})`,
      isActive: true,
    };

    await addSubscription(newSubInput);
    const appName = selectedApp.name;
    setSelectedApp(null);
    showToast(appName);
  };

  // Open custom modal pre-filled
  const handleOpenCustomPrefill = (app: ExploreAppItem, tier?: PlanTier) => {
    const t = tier || app.tiers[0];
    const prefill: SubscriptionItem = {
      id: Date.now(),
      userId: 'demo_user',
      name: app.name,
      price: t ? t.price : app.basePrice,
      currency: 'USD',
      category: app.category,
      billingCycle: t ? t.billingCycle : 'monthly',
      renewalDate: '2026-12-18',
      daysLeft: 30,
      remindDaysBefore: 3,
      paymentMethod: 'Visa •••• 4242',
      cardColor: app.cardColor,
      iconColor: '#0f172a',
      notes: t ? `${t.name} plan` : 'Added from Explore',
      isActive: true,
    };
    setSelectedApp(null);
    setCustomPrefillData(prefill);
    setCustomModalVisible(true);
  };

  const handleOpenWebsite = (url: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FEFBF6' }} edges={['top']}>
      {/* Toast Notification */}
      {toastMessage && (
        <View className="absolute top-12 left-5 right-5 z-50 bg-[#121722] rounded-2xl p-4 flex-row items-center justify-between shadow-2xl border border-white/10">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center mr-3">
              <CheckCircle2 size={18} color="#10b981" />
            </View>
            <Text className="text-white text-xs font-bold flex-1" numberOfLines={2}>
              {toastMessage}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/subscriptions')}
            className="px-3 py-1.5 rounded-full bg-[#F1654C]">
            <Text className="text-white text-xs font-black">View</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        className="px-5">
        {/* Header */}
        <View className="pt-4 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-black text-slate-900 tracking-tight">
                Explore Apps
              </Text>
              <Text className="text-xs font-semibold text-slate-500 mt-1">
                Discover popular services & track your subscriptions
              </Text>
            </View>
            <View className="px-3 py-1.5 rounded-full bg-[#F1654C]/10 border border-[#F1654C]/20 flex-row items-center">
              <Sparkles size={13} color="#F1654C" />
              <Text className="text-[11px] font-black text-[#F1654C] ml-1.5">
                {EXPLORE_APPS.length} Apps
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row items-center bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-xs">
          <Search size={18} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Netflix, ChatGPT, Spotify, Canva..."
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-2 text-sm text-slate-900 font-medium"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Filter Pills */}
        <View className="flex-row items-center mt-3 gap-2">
          <TouchableOpacity
            onPress={() => setQuickFilter('all')}
            className={`px-3 py-1.5 rounded-xl border flex-row items-center ${
              quickFilter === 'all'
                ? 'bg-slate-900 border-slate-900'
                : 'bg-white border-slate-200'
            }`}>
            <Text
              className={`text-xs font-bold ${
                quickFilter === 'all' ? 'text-white' : 'text-slate-600'
              }`}>
              All Services
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setQuickFilter(quickFilter === 'trial' ? 'all' : 'trial')}
            className={`px-3 py-1.5 rounded-xl border flex-row items-center ${
              quickFilter === 'trial'
                ? 'bg-[#F1654C] border-[#F1654C]'
                : 'bg-white border-slate-200'
            }`}>
            <Gift
              size={13}
              color={quickFilter === 'trial' ? '#FFFFFF' : '#F1654C'}
            />
            <Text
              className={`text-xs font-bold ml-1.5 ${
                quickFilter === 'trial' ? 'text-white' : 'text-slate-700'
              }`}>
              Free Trials
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setQuickFilter(quickFilter === 'budget' ? 'all' : 'budget')}
            className={`px-3 py-1.5 rounded-xl border flex-row items-center ${
              quickFilter === 'budget'
                ? 'bg-emerald-600 border-emerald-600'
                : 'bg-white border-slate-200'
            }`}>
            <Text
              className={`text-xs font-bold ${
                quickFilter === 'budget' ? 'text-white' : 'text-slate-700'
              }`}>
              Budget Plans
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 -mx-5 px-5"
          contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
          {EXPLORE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
                className={`px-4 py-2 rounded-full border ${
                  isSelected
                    ? 'bg-[#121722] border-[#121722]'
                    : 'bg-white border-slate-200'
                }`}>
                <Text
                  className={`text-xs font-black ${
                    isSelected ? 'text-white' : 'text-slate-700'
                  }`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Banner (Shown when no active search) */}
        {!searchQuery && selectedCategory === 'All' && quickFilter === 'all' && (
          <View className="mt-5 rounded-3xl p-5 bg-[#121722] shadow-xl border border-white/5 relative overflow-hidden">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Sparkles size={16} color="#F7D267" />
                <Text className="text-[11px] font-black tracking-widest text-[#F7D267] uppercase ml-1.5">
                  Featured Spotlight
                </Text>
              </View>
              <View className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30">
                <Text className="text-[10px] font-extrabold text-emerald-400">
                  Trending #1
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <BrandIcon name="OpenAI ChatGPT" size={48} />
              <View className="ml-3.5 flex-1">
                <Text className="text-white text-lg font-black">
                  OpenAI ChatGPT Plus
                </Text>
                <Text className="text-slate-400 text-xs font-medium mt-0.5" numberOfLines={2}>
                  Access GPT-4o, Advanced Voice, Canvas workspace, and custom GPTs.
                </Text>
              </View>
            </View>

            <View className="mt-4 pt-3 border-t border-white/10 flex-row items-center justify-between">
              <View>
                <Text className="text-[11px] font-medium text-slate-400">
                  From
                </Text>
                <Text className="text-white text-base font-black">
                  {formatCurrency(20.0, currency)}
                  <Text className="text-slate-400 text-xs font-medium"> /month</Text>
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  const chatGptApp = EXPLORE_APPS.find((a) => a.id === 'chatgpt');
                  if (chatGptApp) {
                    setSelectedApp(chatGptApp);
                    setSelectedTierIndex(1); // Plus tier
                  }
                }}
                className="px-4 py-2.5 rounded-full bg-[#F1654C] flex-row items-center shadow-md">
                <Text className="text-white font-extrabold text-xs mr-1">
                  Explore Plans
                </Text>
                <ArrowRight size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Section Title */}
        <View className="flex-row items-center justify-between mt-6 mb-3">
          <Text className="text-lg font-black text-slate-900 tracking-tight">
            {selectedCategory === 'All' ? 'Popular Services' : `${selectedCategory} Apps`}
          </Text>
          <Text className="text-xs font-bold text-slate-500">
            {filteredApps.length} {filteredApps.length === 1 ? 'result' : 'results'}
          </Text>
        </View>

        {/* App List */}
        {filteredApps.length === 0 ? (
          <View className="py-12 items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 my-4">
            <Search size={32} color="#94A3B8" />
            <Text className="text-base font-extrabold text-slate-800 mt-3">
              No matching apps found
            </Text>
            <Text className="text-xs text-slate-500 text-center px-8 mt-1">
              Try searching for &quot;Netflix&quot;, &quot;Spotify&quot;, &quot;Canva&quot;, or tap All Services.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setQuickFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#F1654C]">
              <Text className="text-white text-xs font-black">Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-3">
            {filteredApps.map((app) => {
              const alreadyTracked = isAlreadySubscribed(app.name);

              return (
                <TouchableOpacity
                  key={app.id}
                  activeOpacity={0.92}
                  onPress={() => {
                    setSelectedApp(app);
                    setSelectedTierIndex(0);
                  }}
                  className="bg-white rounded-[24px] p-4 border border-slate-200/90 shadow-xs flex-col">
                  {/* Top row: Brand + Info + Action */}
                  <View className="flex-row items-center justify-between">
                    {/* Brand Icon + Name */}
                    <View className="flex-row items-center flex-1 mr-3">
                      <BrandIcon name={app.name} size={46} />
                      <View className="ml-3 flex-1">
                        <View className="flex-row items-center gap-1.5 flex-wrap">
                          <Text className="text-base font-black text-slate-900 tracking-tight">
                            {app.name}
                          </Text>
                          {app.popularTag && (
                            <View className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300">
                              <Text className="text-[9px] font-black text-amber-800 uppercase">
                                {app.popularTag}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View className="flex-row items-center mt-0.5 gap-2">
                          <Text className="text-xs font-semibold text-slate-500">
                            {app.category}
                          </Text>
                          <Text className="text-slate-300">•</Text>
                          <View className="flex-row items-center">
                            <Star size={11} color="#f59e0b" fill="#f59e0b" />
                            <Text className="text-[11px] font-bold text-slate-700 ml-1">
                              {app.rating}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Price & Quick Add Button */}
                    <View className="items-end">
                      <Text className="text-sm font-black text-slate-900">
                        {formatCurrency(app.basePrice, currency)}
                        <Text className="text-[10px] text-slate-500 font-medium">/mo</Text>
                      </Text>

                      {alreadyTracked ? (
                        <View className="mt-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 flex-row items-center">
                          <Check size={12} color="#059669" strokeWidth={3} />
                          <Text className="text-[11px] font-black text-emerald-700 ml-1">
                            In Plans
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(app);
                          }}
                          className="mt-1.5 px-3 py-1.5 rounded-full bg-[#F1654C] flex-row items-center shadow-xs">
                          <Plus size={13} color="#FFFFFF" strokeWidth={2.8} />
                          <Text className="text-[11px] font-black text-white ml-1">
                            Add Plan
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Description preview */}
                  <Text
                    className="text-xs text-slate-600 mt-2.5 font-medium leading-4"
                    numberOfLines={2}>
                    {app.description}
                  </Text>

                  {/* Badges / Features row */}
                  <View className="mt-3 pt-2.5 border-t border-slate-100 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1.5 flex-1 mr-2 flex-wrap">
                      {app.trialBadge && (
                        <View className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200">
                          <Text className="text-[10px] font-bold text-rose-700">
                            {app.trialBadge}
                          </Text>
                        </View>
                      )}
                      <View className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                        <Text className="text-[10px] font-semibold text-slate-700">
                          {app.tiers.length} plans available
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="text-[11px] font-bold text-slate-500 mr-0.5">
                        Details
                      </Text>
                      <ChevronRight size={13} color="#94A3B8" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* App Details Modal */}
      {selectedApp && (
        <Modal
          visible={Boolean(selectedApp)}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedApp(null)}>
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-[#FEFBF6] rounded-t-[36px] max-h-[88%] p-6 shadow-2xl border-t border-slate-200">
              {/* Modal Drag Indicator */}
              <View className="w-12 h-1.5 bg-slate-300 rounded-full self-center mb-4" />

              {/* Header: Icon + Title + Close */}
              <View className="flex-row items-center justify-between pb-3">
                <View className="flex-row items-center flex-1 mr-3">
                  <BrandIcon name={selectedApp.name} size={54} />
                  <View className="ml-3.5 flex-1">
                    <Text className="text-xl font-black text-slate-900 tracking-tight">
                      {selectedApp.name}
                    </Text>
                    <View className="flex-row items-center mt-1 gap-2">
                      <View className="px-2.5 py-0.5 rounded-full bg-slate-200/80">
                        <Text className="text-[10px] font-black text-slate-800">
                          {selectedApp.category}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Star size={12} color="#f59e0b" fill="#f59e0b" />
                        <Text className="text-xs font-bold text-slate-800 ml-1">
                          {selectedApp.rating} ({selectedApp.reviewCount})
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedApp(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
                  <X size={18} color="#475569" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} className="my-2">
                {/* Description */}
                <Text className="text-xs text-slate-600 font-medium leading-5 mt-1">
                  {selectedApp.description}
                </Text>

                {/* Plan Tiers Selector */}
                <Text className="text-xs font-black uppercase tracking-wider text-slate-400 mt-5 mb-2.5">
                  Select Subscription Plan
                </Text>
                <View className="gap-2">
                  {selectedApp.tiers.map((tier, idx) => {
                    const isSelected = selectedTierIndex === idx;
                    return (
                      <TouchableOpacity
                        key={tier.name}
                        activeOpacity={0.85}
                        onPress={() => setSelectedTierIndex(idx)}
                        className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                          isSelected
                            ? 'bg-white border-[#F1654C] shadow-sm'
                            : 'bg-white/60 border-slate-200'
                        }`}>
                        <View className="flex-1 mr-3">
                          <View className="flex-row items-center">
                            <View
                              className={`w-4 h-4 rounded-full border items-center justify-center mr-2 ${
                                isSelected
                                  ? 'border-[#F1654C] bg-[#F1654C]'
                                  : 'border-slate-300 bg-white'
                              }`}>
                              {isSelected && <View className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </View>
                            <Text className="text-sm font-black text-slate-900">
                              {tier.name}
                            </Text>
                          </View>
                          {tier.features ? (
                            <Text className="text-[11px] font-medium text-slate-500 ml-6 mt-0.5">
                              {tier.features}
                            </Text>
                          ) : null}
                        </View>

                        <View className="items-end">
                          <Text className="text-sm font-black text-slate-900">
                            {formatCurrency(tier.price, currency)}
                          </Text>
                          <Text className="text-[10px] font-medium text-slate-500">
                            /{tier.billingCycle === 'yearly' ? 'yr' : 'mo'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Included Features Checklist */}
                <Text className="text-xs font-black uppercase tracking-wider text-slate-400 mt-5 mb-2.5">
                  What You Get
                </Text>
                <View className="bg-white rounded-2xl p-4 border border-slate-200/90 gap-2.5">
                  {selectedApp.features.map((feat) => (
                    <View key={feat} className="flex-row items-center">
                      <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center mr-2.5">
                        <Check size={12} color="#059669" strokeWidth={3} />
                      </View>
                      <Text className="text-xs text-slate-700 font-semibold flex-1">
                        {feat}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Official Website Link Button */}
                <TouchableOpacity
                  onPress={() => handleOpenWebsite(selectedApp.officialUrl)}
                  className="mt-4 flex-row items-center justify-center py-2.5 rounded-xl border border-slate-200 bg-white">
                  <ExternalLink size={14} color="#64748B" />
                  <Text className="text-xs font-bold text-slate-600 ml-2">
                    Visit Official {selectedApp.name} Website
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Bottom Actions */}
              <View className="pt-3 border-t border-slate-200 flex-row gap-2.5">
                <TouchableOpacity
                  onPress={() =>
                    handleOpenCustomPrefill(
                      selectedApp,
                      selectedApp.tiers[selectedTierIndex]
                    )
                  }
                  className="flex-1 py-3.5 rounded-full border border-slate-300 bg-white items-center justify-center">
                  <Text className="text-slate-800 font-black text-xs">
                    Customize Details
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAddFromModal}
                  className="flex-1 py-3.5 rounded-full bg-[#F1654C] items-center justify-center shadow-md">
                  <Text className="text-white font-black text-xs">
                    Add to Subscriptions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Customize / Edit Modal */}
      {customModalVisible && (
        <SubscriptionModal
          visible={customModalVisible}
          onClose={() => {
            setCustomModalVisible(false);
            setCustomPrefillData(null);
          }}
          subscriptionToEdit={customPrefillData}
        />
      )}
    </SafeAreaView>
  );
}
