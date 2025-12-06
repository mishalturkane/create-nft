import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  createNft, 
  fetchDigitalAsset 
} from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { useUmi } from '../context/useUmi';
import { MONAD_METADATA } from '../constants/metadata';
import { 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Image as ImageIcon,
  Loader2,
  Shield,
  Users,
  Wallet
} from 'lucide-react';

export const CreateMonadNFT = () => {
  const { umi } = useUmi();
  const { publicKey, connected } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [nftAddress, setNftAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewOnExplorer = (address: string) => {
    window.open(`https://explorer.solana.com/address/${address}?cluster=devnet`, '_blank');
  };

  const createNFT = async () => {
    if (!publicKey || !umi) {
      setError('Please connect your wallet first');
      return;
    }

    setIsCreating(true);
    setError('');
    
    try {
      // 1. Generate a new mint address
      const mint = generateSigner(umi);
      
      // 2. Create the NFT with metadata
      await createNft(umi, {
        mint,
        name: MONAD_METADATA.name,
        symbol: MONAD_METADATA.symbol,
        uri: '', // Leave empty or add a URI if you host the JSON
        sellerFeeBasisPoints: percentAmount(0), // 0% royalty
        creators: [
          {
            address: umi.identity.publicKey,
            verified: true,
            share: 100,
          },
        ],
        isMutable: true, // Allow future updates
      }).sendAndConfirm(umi);

      // 3. Store the mint address
      const mintAddress = mint.publicKey.toString();
      setNftAddress(mintAddress);
      
      // 4. Fetch and display the created NFT
      const asset = await fetchDigitalAsset(umi, mint.publicKey);
      console.log('NFT Details:', asset);

    } catch (error: any) {
      console.error('Error creating NFT:', error);
      setError(error.message || 'Failed to create NFT. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            MONAD NFT Creator
          </h1>
          <p className="text-gray-400 text-lg">
            Create your unique MONAD token on Solana blockchain
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - NFT Preview */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-400" />
              NFT Preview
            </h2>
            
            <div className="space-y-6">
              {/* NFT Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <img 
                  src={MONAD_METADATA.image} 
                  alt="MONAD NFT" 
                  className="relative w-full h-64 md:h-80 object-cover rounded-xl border-2 border-gray-700 group-hover:border-blue-500 transition-all duration-300"
                />
              </div>

              {/* NFT Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{MONAD_METADATA.name}</h3>
                    <p className="text-gray-400">#{MONAD_METADATA.symbol}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                    Solana NFT
                  </span>
                </div>

                <p className="text-gray-300">{MONAD_METADATA.description}</p>

                {/* Attributes */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Attributes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {MONAD_METADATA.attributes.map((attr, index) => (
                      <div 
                        key={index}
                        className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <div className="text-xs text-gray-400">{attr.trait_type}</div>
                        <div className="text-sm font-medium">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collection Info */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Collection</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{MONAD_METADATA.collection.name}</div>
                      <div className="text-sm text-gray-400">{MONAD_METADATA.collection.family}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Creation Panel */}
          <div className="space-y-8">
            {/* Wallet Connection Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-blue-400" />
                Wallet Status
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="font-medium">
                      {connected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  {publicKey && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(publicKey.toString())}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Copy address"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {!connected && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <p className="text-yellow-400 text-sm">
                      Please connect your wallet to create an NFT
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Creation Panel */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Create NFT</h2>
              
              <div className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>0% Royalty Fees</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Mutable Metadata (can be updated)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Creator Verified</span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                {/* Create Button */}
                <button
                  onClick={createNFT}
                  disabled={!connected || isCreating}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3
                    ${!connected || isCreating 
                      ? 'bg-gray-700 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25'
                    }`}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating NFT...
                    </>
                  ) : (
                    'Create MONAD NFT'
                  )}
                </button>

                {/* Success Message */}
                {nftAddress && (
                  <div className="animate-fadeIn">
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <h3 className="text-xl font-semibold">NFT Created Successfully!</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">NFT Address</label>
                          <div className="flex items-center gap-2 p-3 bg-gray-900/50 rounded-lg">
                            <code className="text-sm flex-1 truncate">
                              {nftAddress}
                            </code>
                            <div className="flex gap-2">
                              <button
                                onClick={() => copyToClipboard(nftAddress)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                title="Copy address"
                              >
                                {copied ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => viewOnExplorer(nftAddress)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                title="View on Explorer"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-900/30 rounded-lg">
                            <div className="text-sm text-gray-400">Network</div>
                            <div className="font-semibold">Solana Devnet</div>
                          </div>
                          <div className="p-4 bg-gray-900/30 rounded-lg">
                            <div className="text-sm text-gray-400">Token Standard</div>
                            <div className="font-semibold">Metaplex NFT</div>
                          </div>
                        </div>

                        <button
                          onClick={() => viewOnExplorer(nftAddress)}
                          className="w-full py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on Solana Explorer
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-400">
                    <strong>Note:</strong> This will create a new NFT on Solana devnet. 
                    You'll need a small amount of SOL for transaction fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            Powered by Metaplex • Solana • Umi Framework
          </p>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};