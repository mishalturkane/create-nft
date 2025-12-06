import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  createNft, 
  fetchDigitalAsset 
} from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { useUmi } from '../context/useUmi';

// Import the wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

export const CreateMonadNFT = () => {
  const { umi } = useUmi();
  const { publicKey, connected } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [nftAddress, setNftAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Input states for NFT metadata
  const [nftName, setNftName] = useState('My NFT');
  const [nftSymbol, setNftSymbol] = useState('NFT');
  const [nftUri, setNftUri] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftImage, setNftImage] = useState('');

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

    // Basic validation
    if (!nftName.trim()) {
      setError('Please enter a name for your NFT');
      return;
    }

    if (!nftSymbol.trim()) {
      setError('Please enter a symbol for your NFT');
      return;
    }

    if (!nftUri.trim()) {
      setError('Please enter a metadata URI for your NFT');
      return;
    }

    setIsCreating(true);
    setError('');
    
    try {
      const mint = generateSigner(umi);
      
      await createNft(umi, {
        mint,
        name: nftName,
        symbol: nftSymbol,
        uri: nftUri,
        sellerFeeBasisPoints: percentAmount(0),
        creators: [
          {
            address: umi.identity.publicKey,
            verified: true,
            share: 100,
          },
        ],
        isMutable: true,
      }).sendAndConfirm(umi);

      const mintAddress = mint.publicKey.toString();
      setNftAddress(mintAddress);
      
      const asset = await fetchDigitalAsset(umi, mint.publicKey);
      console.log('NFT Details:', asset);

    } catch (error: any) {
      console.error('Error creating NFT:', error);
      setError(error.message || 'Failed to create NFT. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px',
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '48px',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '16px',
    },
    subtitle: {
      color: '#94a3b8',
      fontSize: '18px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '32px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    '@media (min-width: 768px)': {
      grid: {
        gridTemplateColumns: '1fr 1fr',
      }
    },
    card: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    cardHeader: {
      fontSize: '24px',
      fontWeight: 600,
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    nftImage: {
      width: '100%',
      height: '300px',
      objectFit: 'cover' as const,
      borderRadius: '12px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '20px',
    },
    attributeBadge: {
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '8px 12px',
      display: 'inline-block',
      margin: '4px',
    },
    walletStatus: {
      padding: '16px',
      background: 'rgba(15, 23, 42, 0.5)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    statusDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: connected ? '#10b981' : '#ef4444',
      marginRight: '12px',
    },
    inputLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 500,
      marginBottom: '8px',
      color: '#e2e8f0',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '16px',
      marginBottom: '16px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
    inputDescription: {
      fontSize: '12px',
      color: '#94a3b8',
      marginBottom: '16px',
      lineHeight: '1.5',
    },
    createButton: {
      width: '100%',
      padding: '16px 24px',
      fontSize: '18px',
      fontWeight: 600,
      borderRadius: '12px',
      border: 'none',
      cursor: connected && !isCreating ? 'pointer' : 'not-allowed',
      background: connected && !isCreating 
        ? 'linear-gradient(45deg, #3b82f6 0%, #8b5cf6 100%)'
        : '#475569',
      color: 'white',
      transition: 'all 0.3s ease',
      marginTop: '20px',
    },
    successCard: {
      background: 'rgba(22, 163, 74, 0.1)',
      border: '1px solid rgba(22, 163, 74, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px',
    },
    addressBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      background: 'rgba(15, 23, 42, 0.5)',
      borderRadius: '8px',
      margin: '16px 0',
    },
    copyButton: {
      padding: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      color: 'white',
    },
    explorerButton: {
      width: '100%',
      padding: '12px',
      background: 'rgba(59, 130, 246, 0.2)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '8px',
      color: '#60a5fa',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px',
    },
    errorBox: {
      padding: '16px',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '12px',
      color: '#f87171',
      margin: '16px 0',
    },
    infoBox: {
      padding: '16px',
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '12px',
      color: '#93c5fd',
      fontSize: '14px',
      marginTop: '20px',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    featureDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
    footer: {
      marginTop: '40px',
      paddingTop: '20px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center' as const,
      color: '#64748b',
      fontSize: '14px',
    },
    previewSection: {
      marginBottom: '24px',
    },
    previewLabel: {
      color: '#94a3b8',
      fontSize: '14px',
      marginBottom: '8px',
    },
    previewValue: {
      fontSize: '16px',
      fontWeight: 500,
    },
    walletConnectContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    // Custom styles for the wallet button
    customWalletButton: {
      background: 'linear-gradient(45deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
      }
    },
  };

  return (
    <div style={styles.container}>
      {/* Header with wallet button */}
      <div style={styles.headerTop}>
        <div>
          <h1 style={styles.title}>NFT Creator</h1>
          <p style={styles.subtitle}>Create your unique NFT on Solana blockchain</p>
        </div>
        <div style={styles.walletConnectContainer}>
          <WalletMultiButton 
            style={{
              background: 'linear-gradient(45deg, #3b82f6 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
           
          />
        </div>
      </div>

      <div style={styles.grid as React.CSSProperties}>
        {/* Left Panel - NFT Preview */}
        <div style={styles.card}>
          <h2 style={styles.cardHeader}>
            <span style={{ color: '#60a5fa' }}>🖼️</span> NFT Preview
          </h2>
          
          <div>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                borderRadius: '12px',
                filter: 'blur(20px)',
              }} />
              <img 
                src={nftImage || 'https://via.placeholder.com/400x300?text=NFT+Image'} 
                alt="NFT Preview" 
                style={styles.nftImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>{nftName || 'My NFT'}</h3>
                  <p style={{ color: '#94a3b8' }}>#{nftSymbol || 'NFT'}</p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  Solana NFT
                </span>
              </div>

              <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
                {nftDescription || 'No description provided'}
              </p>

              <div style={styles.previewSection}>
                <div style={styles.previewLabel}>Metadata URI</div>
                <div style={styles.previewValue}>
                  {nftUri ? (
                    <a 
                      href={nftUri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#60a5fa', textDecoration: 'none' }}
                    >
                      {nftUri.length > 40 ? `${nftUri.slice(0, 40)}...` : nftUri}
                    </a>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>Not set</span>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '12px', color: '#e2e8f0' }}>Properties</h4>
                <div style={styles.attributeBadge}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Creator</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>
                    {publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : 'Not connected'}
                  </div>
                </div>
                <div style={styles.attributeBadge}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Mutable</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Yes</div>
                </div>
                <div style={styles.attributeBadge}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Royalties</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>0%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Creation Panel */}
        <div>
          {/* Wallet Status */}
          <div style={styles.card}>
            <h2 style={styles.cardHeader}>
              <span style={{ color: '#60a5fa' }}>👛</span> Wallet Status
            </h2>
            
            <div style={styles.walletStatus}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={styles.statusDot} />
                <span style={{ fontWeight: 500 }}>
                  {connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              {publicKey && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>
                    {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(publicKey.toString())}
                    style={styles.copyButton}
                    title="Copy address"
                  >
                    {copied ? '✓' : '📋'}
                  </button>
                </div>
              )}
            </div>

            {!connected && (
              <div style={{
                padding: '16px',
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.2)',
                borderRadius: '12px',
                color: '#fbbf24',
              }}>
                <p style={{ fontSize: '14px' }}>
                  Please connect your wallet to create an NFT
                </p>
              </div>
            )}
          </div>

          {/* Creation Panel */}
          <div style={{ ...styles.card, marginTop: '24px' }}>
            <h2 style={styles.cardHeader}>Create NFT</h2>
            
            <div>
              {/* Input Fields */}
              <div style={{ marginBottom: '24px' }}>
                <label style={styles.inputLabel}>
                  NFT Name *
                </label>
                <input
                  type="text"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  placeholder="Enter NFT name"
                  style={styles.input}
                  maxLength={32}
                />
                <div style={styles.inputDescription}>
                  The name of your NFT (max 32 characters)
                </div>

                <label style={styles.inputLabel}>
                  Symbol *
                </label>
                <input
                  type="text"
                  value={nftSymbol}
                  onChange={(e) => setNftSymbol(e.target.value.toUpperCase())}
                  placeholder="Enter symbol (e.g., NFT)"
                  style={styles.input}
                  maxLength={10}
                />
                <div style={styles.inputDescription}>
                  The symbol/ticker for your NFT (max 10 characters)
                </div>

                <label style={styles.inputLabel}>
                  Metadata URI *
                </label>
                <input
                  type="text"
                  value={nftUri}
                  onChange={(e) => setNftUri(e.target.value)}
                  placeholder="https://your-metadata.json"
                  style={styles.input}
                />
                <div style={styles.inputDescription}>
                  URI pointing to your NFT's metadata JSON file
                </div>

                <label style={styles.inputLabel}>
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={nftImage}
                  onChange={(e) => setNftImage(e.target.value)}
                  placeholder="https://your-image.png"
                  style={styles.input}
                />
                <div style={styles.inputDescription}>
                  Direct URL to your NFT image for preview
                </div>

                <label style={styles.inputLabel}>
                  Description (Optional)
                </label>
                <textarea
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                  placeholder="Describe your NFT..."
                  style={{
                    ...styles.input,
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  maxLength={200}
                />
                <div style={styles.inputDescription}>
                  Brief description of your NFT (max 200 characters)
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '24px' }}>
                <div style={styles.featureItem}>
                  <div style={{ ...styles.featureDot, backgroundColor: '#10b981' }} />
                  <span>0% Royalty Fees</span>
                </div>
                <div style={styles.featureItem}>
                  <div style={{ ...styles.featureDot, backgroundColor: '#3b82f6' }} />
                  <span>Mutable Metadata (can be updated)</span>
                </div>
                <div style={styles.featureItem}>
                  <div style={{ ...styles.featureDot, backgroundColor: '#8b5cf6' }} />
                  <span>Creator Verified</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div style={styles.errorBox}>
                  <p>{error}</p>
                </div>
              )}

              {/* Create Button */}
              <button
                onClick={createNFT}
                disabled={!connected || isCreating}
                style={styles.createButton}
                onMouseOver={(e) => {
                  if (connected && !isCreating) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (connected && !isCreating) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {isCreating ? 'Creating NFT...' : 'Create NFT'}
              </button>

              {/* Success Message */}
              {nftAddress && (
                <div style={styles.successCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      background: '#16a34a',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span style={{ color: 'white', fontWeight: 'bold' }}>✓</span>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#166534' }}>NFT Created Successfully!</h3>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>NFT Address</div>
                    <div style={styles.addressBox}>
                      <code style={{ fontSize: '14px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {nftAddress}
                      </code>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => copyToClipboard(nftAddress)}
                          style={styles.copyButton}
                          title="Copy address"
                        >
                          {copied ? '✓ Copied!' : '📋'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0' }}>
                    <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.3)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Network</div>
                      <div style={{ fontWeight: 600 }}>Solana Devnet</div>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.3)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Token Standard</div>
                      <div style={{ fontWeight: 600 }}>Metaplex NFT</div>
                    </div>
                  </div>

                  <button
                    onClick={() => viewOnExplorer(nftAddress)}
                    style={styles.explorerButton}
                  >
                    🔍 View on Solana Explorer
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div style={styles.infoBox}>
                <p>
                  <strong>Note:</strong> This will create a new NFT on Solana devnet. 
                  You'll need a small amount of SOL for transaction fees.
                </p>
                <p style={{ marginTop: '8px' }}>
                  <strong>Metadata URI:</strong> Should point to a JSON file with your NFT's metadata 
                  (name, description, image, attributes, etc.).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>Powered by Metaplex • Solana • Umi Framework</p>
      </div>
    </div>
  );
};