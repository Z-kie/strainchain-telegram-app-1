import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Bot, Leaf, Shield, Zap, ExternalLink, Copy, Settings } from 'lucide-react';

const StrainChainChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Welcome to StrainChain! 🌿 I'm your cannabis NFT authentication assistant. I can help you with strain verification, Pi Network integration, cultivator onboarding, and more. How can I assist you today?",
      timestamp: Date.now()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [chatbotConfig, setChatbotConfig] = useState({
    isConfigMode: false,
    apiKey: '',
    cultivatorMode: false,
    adminMode: false
  });
  
  const messagesEndRef = useRef(null);

  const quickActions = [
    { id: 'verify-strain', icon: Shield, text: 'Verify a Strain', category: 'verification' },
    { id: 'create-nft', icon: Leaf, text: 'Create NFT Certificate', category: 'nft' },
    { id: 'pi-wallet', icon: Zap, text: 'Pi Wallet Setup', category: 'pi-network' },
    { id: 'cultivator-signup', icon: User, text: 'Cultivator Registration', category: 'onboarding' },
    { id: 'marketplace', icon: ExternalLink, text: 'Browse Marketplace', category: 'marketplace' },
    { id: 'support', icon: MessageCircle, text: 'Technical Support', category: 'support' }
  ];

  const knowledgeBase = {
    verification: {
      'verify-strain': "To verify a strain on StrainChain:\n\n1. **Upload strain photo** - High-quality images of buds\n2. **Enter genetics info** - Parent strains, THC/CBD levels\n3. **Add cultivation details** - Growing method, harvest date\n4. **Pi Network verification** - Connect your Pi wallet\n5. **Generate NFT certificate** - Blockchain-verified authenticity\n\nNeed help with any specific step?",
      keywords: ['verify', 'authenticate', 'validation', 'certificate', 'genuine', 'real']
    },
    nft: {
      'create-nft': "Creating NFT certificates on StrainChain:\n\n**Requirements:**\n• Verified cultivator account\n• Pi Network wallet connected\n• Strain verification completed\n• High-quality strain photography\n\n**Process:**\n1. Complete strain verification\n2. Set NFT parameters (quantity, pricing)\n3. Pay minting fee in Pi (≈0.1 Pi per NFT)\n4. Publish to marketplace\n\n**Benefits:**\n• Tamper-proof authenticity\n• Secondary market royalties\n• Brand protection\n\nReady to start?",
      keywords: ['nft', 'certificate', 'mint', 'create', 'token', 'blockchain']
    },
    'pi-network': {
      'pi-wallet': "Setting up Pi Network integration:\n\n**Step 1: Pi Wallet Setup**\n• Download Pi Browser app\n• Create/access Pi wallet\n• Complete KYC verification\n• Ensure mainnet access\n\n**Step 2: StrainChain Connection**\n• Login to StrainChain platform\n• Go to Wallet Settings\n• Click 'Connect Pi Wallet'\n• Authorize StrainChain permissions\n\n**Troubleshooting:**\n• Wallet not showing? Clear browser cache\n• Connection failed? Check Pi Network status\n• KYC pending? Complete in Pi app first\n\nNeed specific help?",
      keywords: ['pi', 'wallet', 'connect', 'setup', 'mainnet', 'kyc']
    },
    onboarding: {
      'cultivator-signup': "Becoming a verified StrainChain cultivator:\n\n**Eligibility Requirements:**\n• Valid cannabis cultivation license\n• Business registration documents\n• Facility inspection certificates\n• Pi Network KYC completed\n\n**Application Process:**\n1. **Submit documents** - License, permits, insurance\n2. **Facility verification** - Photos, compliance records\n3. **Background check** - Clean regulatory history\n4. **Pi wallet connection** - Verified Pi Network account\n5. **Trial period** - 30-day supervised onboarding\n\n**Benefits:**\n• NFT minting capabilities\n• Marketplace access\n• Brand protection tools\n• Direct consumer sales\n\n**Application fee:** 10 Pi (refundable upon approval)\n\nReady to apply?",
      keywords: ['cultivator', 'signup', 'register', 'license', 'verification', 'apply']
    },
    marketplace: {
      'marketplace': "StrainChain Marketplace features:\n\n**For Consumers:**\n• Verified strain authenticity\n• QR code scanning\n• Strain history & genetics\n• Cultivator profiles\n• Price comparison\n• Pi payment integration\n\n**For Cultivators:**\n• Direct sales platform\n• NFT certificate showcase\n• Customer analytics\n• Inventory management\n• Automated compliance reporting\n\n**Search & Filter:**\n• By strain type (Indica/Sativa/Hybrid)\n• THC/CBD levels\n• Growing method (Indoor/Outdoor/Hydro)\n• Price range\n• Geographic location\n• Cultivator rating\n\n**Pi Network Benefits:**\n• Lower transaction fees\n• Instant settlements\n• Global accessibility\n\nExplore specific categories?",
      keywords: ['marketplace', 'buy', 'sell', 'browse', 'search', 'shop']
    },
    support: {
      'support': "StrainChain Technical Support:\n\n**Common Issues:**\n\n🔧 **Platform Issues**\n• Login problems → Reset password or clear cache\n• Slow loading → Check Pi Network connection\n• Upload failures → Reduce image size (<5MB)\n\n💰 **Pi Network Issues**\n• Wallet connection → Ensure Pi Browser updated\n• Transaction failures → Check Pi balance\n• KYC problems → Complete in Pi app first\n\n📋 **Verification Issues**\n• Document rejection → Check file format (PDF/JPG)\n• License validation → Contact issuing authority\n• Compliance flags → Review state regulations\n\n**Contact Options:**\n• Discord: discord.gg/strainchain\n• Email: support@strainchain.io\n• Telegram: @StrainChainSupport\n\n**Response Times:**\n• Critical: <2 hours\n• General: <24 hours\n• Documentation: <48 hours\n\nWhat specific issue can I help with?",
      keywords: ['help', 'support', 'problem', 'issue', 'error', 'bug', 'troubleshoot']
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Check for specific quick action matches
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (data.keywords && data.keywords.some(keyword => lowerInput.includes(keyword))) {
        const actionKey = Object.keys(data).find(key => key !== 'keywords');
        return data[actionKey] || data[category];
      }
    }

    // Greeting responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! Welcome to StrainChain. I'm here to help you with cannabis NFT authentication on the Pi Network. What would you like to know about?";
    }

    // Pricing inquiries
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('fee')) {
      return "StrainChain Pricing:\n\n💰 **Platform Fees:**\n• NFT Minting: 0.1 Pi per certificate\n• Cultivator Registration: 10 Pi (refundable)\n• Marketplace Transactions: 2% + Pi network fees\n• Premium Features: 5 Pi/month\n\n🎯 **Early Adopter Benefits:**\n• 50% off first year for founding cultivators\n• Free NFT minting for first 100 strains\n• Reduced marketplace fees (1%)\n\nInterested in becoming an early partner?";
    }

    // Legal/compliance questions
    if (lowerInput.includes('legal') || lowerInput.includes('compliance') || lowerInput.includes('regulation')) {
      return "StrainChain Legal & Compliance:\n\n⚖️ **Our Approach:**\n• State-by-state compliance monitoring\n• Licensed cultivator verification only\n• Seed-to-sale tracking integration\n• Automated compliance reporting\n\n📋 **Required Documentation:**\n• Valid cultivation license\n• State permits and certifications\n• Insurance documentation\n• Facility inspection records\n\n🌍 **Supported Jurisdictions:**\n• California, Colorado, Nevada (Full Support)\n• Oregon, Washington (Beta)\n• Canada (Coming Soon)\n\n⚠️ **Important:** StrainChain operates only in jurisdictions where cannabis is legal. All users must comply with local laws.\n\nNeed help with compliance in your state?";
    }

    // Technical questions
    if (lowerInput.includes('technical') || lowerInput.includes('api') || lowerInput.includes('integration')) {
      return "StrainChain Technical Integration:\n\n🔧 **Developer Resources:**\n• REST API for strain verification\n• Pi Network SDK integration\n• QR code generation tools\n• Webhook notifications\n\n📚 **Documentation:**\n• API Reference: docs.strainchain.io/api\n• Pi Integration Guide: docs.strainchain.io/pi\n• Sample Code: github.com/strainchain/examples\n\n🛠️ **Integration Options:**\n• POS System Integration\n• Inventory Management APIs\n• E-commerce Platform Plugins\n• Mobile App SDKs\n\n📞 **Developer Support:**\n• Discord: #dev-support\n• Office Hours: Tuesdays 2-4 PM PST\n• Email: dev@strainchain.io\n\nWhat kind of integration are you building?";
    }

    // Default response with suggestions
    return "I'd be happy to help you with that! Here are some areas I can assist with:\n\n🌿 **Strain Verification** - Authenticate your cannabis products\n🎨 **NFT Certificates** - Create blockchain-verified authenticity tokens\n⚡ **Pi Network** - Wallet setup and integration\n👥 **Cultivator Onboarding** - Join as a verified grower\n🛒 **Marketplace** - Buy and sell verified strains\n🔧 **Technical Support** - Platform and integration help\n\nWhat specific topic interests you most?";
  };

  const handleQuickAction = async (actionId) => {
    setShowQuickActions(false);
    
    const action = quickActions.find(a => a.id === actionId);
    const userMessage = {
      role: 'user',
      content: action.text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = knowledgeBase[action.category]?.[actionId] || findBestResponse(action.text);
      
      const botMessage = {
        role: 'bot',
        content: response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);
    setShowQuickActions(false);

    // For demo purposes, using knowledge base
    // In production, this would use the Claude API
    setTimeout(() => {
      let response;
      
      if (chatbotConfig.apiKey) {
        // Simulate Claude API call
        response = `I understand you're asking about "${userInput}". As your StrainChain assistant, I'd analyze this through our cannabis-specific knowledge base and Pi Network integration. In production, this would connect to Claude API for more sophisticated responses.`;
      } else {
        response = findBestResponse(userInput);
      }

      const botMessage = {
        role: 'bot',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const generateImplementationCode = () => {
    return `
// StrainChain Chatbot Implementation
class StrainChainChatbot {
  constructor(config = {}) {
    this.config = {
      apiKey: config.apiKey || '',
      piNetworkEnabled: config.piNetworkEnabled || true,
      cultivatorMode: config.cultivatorMode || false,
      adminMode: config.adminMode || false,
      ...config
    };
    
    this.knowledgeBase = {
      strainVerification: [
        "strain authentication process",
        "NFT certificate creation",
        "blockchain verification steps"
      ],
      piNetworkIntegration: [
        "wallet connection guide",
        "transaction processing",
        "KYC requirements"
      ],
      cultivatorOnboarding: [
        "registration requirements",
        "license verification",
        "compliance documentation"
      ]
    };
  }

  async processMessage(userMessage) {
    // In production, integrate with Claude API
    const prompt = \`
      You are the StrainChain assistant, helping users with cannabis NFT authentication on Pi Network.
      
      Context: StrainChain is a blockchain-based platform for authenticating cannabis strains using NFT certificates on the Pi Network.
      
      User message: \${userMessage}
      
      Respond helpfully about:
      - Strain verification and NFT creation
      - Pi Network wallet integration
      - Cultivator registration and compliance
      - Marketplace features and usage
      - Technical support and troubleshooting
      
      Keep responses informative but concise, and always maintain focus on cannabis industry compliance and Pi Network benefits.
    \`;

    if (this.config.apiKey) {
      try {
        const response = await window.claude.complete(prompt);
        return response;
      } catch (error) {
        console.error('Claude API error:', error);
        return this.getFallbackResponse(userMessage);
      }
    } else {
      return this.getFallbackResponse(userMessage);
    }
  }

  getFallbackResponse(message) {
    // Fallback to knowledge base matching
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('verify') || lowerMessage.includes('authenticate')) {
      return "To verify a strain on StrainChain, you'll need to upload high-quality photos, enter genetics information, and connect your Pi wallet for blockchain verification.";
    }
    
    if (lowerMessage.includes('nft') || lowerMessage.includes('certificate')) {
      return "NFT certificates on StrainChain provide tamper-proof authenticity for your cannabis strains, powered by Pi Network blockchain technology.";
    }
    
    if (lowerMessage.includes('pi') || lowerMessage.includes('wallet')) {
      return "Connect your Pi Network wallet to StrainChain for secure transactions and NFT certificate creation. Make sure you've completed KYC in the Pi app first.";
    }
    
    return "I'm here to help with StrainChain! I can assist with strain verification, NFT certificates, Pi Network integration, and cultivator onboarding. What specific area interests you?";
  }

  // Integration methods
  connectPiWallet() {
    // Pi Network wallet connection logic
    if (window.Pi) {
      return window.Pi.authenticate();
    }
    throw new Error('Pi Network not available');
  }

  async verifyStrain(strainData) {
    // Strain verification API call
    const response = await fetch('/api/strains/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strainData)
    });
    return response.json();
  }

  async createNFT(strainId, metadata) {
    // NFT creation on Pi Network
    const response = await fetch('/api/nft/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strainId, metadata })
    });
    return response.json();
  }
}

// Usage example:
const chatbot = new StrainChainChatbot({
  apiKey: 'your-claude-api-key', // Optional
  piNetworkEnabled: true,
  cultivatorMode: false
});

// HTML Integration:
const chatHTML = \`
<div id="strainchain-chatbot" style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
">
  <!-- Chatbot UI here -->
</div>
\`;
`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">StrainChain Assistant</h1>
              <p className="text-green-100 text-sm">Cannabis NFT Authentication on Pi Network</p>
            </div>
          </div>
          <button
            onClick={() => setChatbotConfig(prev => ({ ...prev, isConfigMode: !prev.isConfigMode }))}
            className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Configuration Panel */}
      {chatbotConfig.isConfigMode && (
        <div className="bg-gray-50 p-4 border-x border-gray-200">
          <h3 className="font-semibold mb-3">Chatbot Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Claude API Key (Optional)</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="sk-ant-..."
                value={chatbotConfig.apiKey}
                onChange={(e) => setChatbotConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to use knowledge base responses</p>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={chatbotConfig.cultivatorMode}
                  onChange={(e) => setChatbotConfig(prev => ({ ...prev, cultivatorMode: e.target.checked }))}
                />
                <span className="text-sm">Cultivator Mode</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={chatbotConfig.adminMode}
                  onChange={(e) => setChatbotConfig(prev => ({ ...prev, adminMode: e.target.checked }))}
                />
                <span className="text-sm">Admin Mode</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white border-x border-gray-200" style={{ height: '500px' }}>
        <div className="flex h-full">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'bot' && (
                    <div className="bg-green-100 p-2 rounded-full">
                      <Bot className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action.id)}
                        className="flex items-center gap-2 p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span>{action.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about strain verification, Pi Network, or cultivator registration..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!userInput.trim() || isTyping}
                  className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Implementation */}
      <div className="bg-gray-100 p-4 rounded-b-lg border-x border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Powered by StrainChain × Pi Network × Claude AI
          </div>
          <button
            onClick={() => {
              const code = generateImplementationCode();
              copyToClipboard(code);
              alert('Implementation code copied to clipboard!');
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            <Copy className="w-3 h-3" />
            Get Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrainChainChatbot;