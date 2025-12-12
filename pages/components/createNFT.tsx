import { useState, useMemo } from 'react';
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

// Custom icons (using standard emojis for simplicity)
const WalletIcon = () => <span>👛</span>;
const NftIcon = () => <span>🖼️</span>;
const SuccessIcon = () => <span>✅</span>;
const ErrorIcon = () => <span>❌</span>;
const CopyIcon = ({ copied }: { copied: boolean }) => (
  <span style={{ fontSize: '20px' }}>{copied ? '✅' : '📋'}</span>
);
const ExplorerIcon = () => <span>🔍</span>;

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
  const [nftUri, setNftUri] = useState('https://example.com/metadata.json');
  const [nftDescription, setNftDescription] = useState('');
  const [nftImage, setNftImage] = useState('');

  const shortAddress = useMemo(() => {
    if (!publicKey) return 'Not connected';
    const base58 = publicKey.toBase58();
    return `${base58.slice(0, 4)}...${base58.slice(-4)}`;
  }, [publicKey]);

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

    if (!nftName.trim() || !nftSymbol.trim() || !nftUri.trim()) {
      setError('Name, Symbol, and Metadata URI are required.');
      return;
    }

    setIsCreating(true);
    setError('');
    setNftAddress('');

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
      const message = error.message.includes('Simulation failed')
        ? 'Transaction failed. Check devnet SOL balance and wallet permissions.'
        : error.message || 'Failed to create NFT. Please try again.';
      setError(message);
    } finally {
      setIsCreating(false);
    }
  };

  // --- Inline Styles Object ---
  // Note: Using standard CSS properties in camelCase
  const styles = {
    // Main Container: Black background, white text, Space Grotesk font (fallback to sans-serif)
    container: {
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '2rem', // p-8
      fontFamily: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    maxWidth: {
      maxWidth: '1280px', // max-w-7xl
      margin: '0 auto', // mx-auto
    },
    header: {
      marginBottom: '2.5rem', // mb-10
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'column' as const,
    },
    title: {
      fontSize: '3rem', // sm:text-6xl
      fontWeight: '800', // font-extrabold
      marginBottom: '0.5rem', // mb-2
      // Gradient text effect (simulated with Webkit)
      background: 'linear-gradient(to right, #ffffff 0%, #60a5fa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      color: '#9ca3af', // text-gray-400
      fontSize: '1.125rem', // text-lg
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem', // gap-8
    },
    '@media (min-width: 1024px)': {
      grid: {
        gridTemplateColumns: '1fr 1fr',
      }
    },
    card: {
      backgroundColor: '#1f2937', // bg-gray-900
      border: '1px solid rgba(55, 65, 81, 0.5)', // border-gray-700/50
      borderRadius: '1rem', // rounded-2xl
      padding: '1.5rem', // p-6
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-2xl
    },
    cardHeader: {
      fontSize: '1.5rem', // text-2xl
      fontWeight: 600, // font-semibold
      marginBottom: '1.5rem', // mb-6
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem', // gap-3
      color: '#ffffff',
    },
    nftImage: {
      width: '100%',
      height: '18rem', // h-72
      objectFit: 'cover' as const,
      borderRadius: '0.75rem', // rounded-xl
      border: '2px solid rgba(55, 65, 81, 0.5)', // border-2 border-gray-700/50
      position: 'relative' as const,
      zIndex: 10,
    },
    inputLabel: {
      display: 'block',
      fontSize: '0.875rem', // text-sm
      fontWeight: 500,
      color: '#d1d5db', // text-gray-300
      marginBottom: '0.25rem', // mb-1
    },
    input: {
      width: '100%',
      padding: '0.75rem', // p-3
      backgroundColor: '#1f2937', // bg-gray-800
      border: '1px solid #374151', // border-gray-700
      borderRadius: '0.5rem', // rounded-lg
      color: '#ffffff',
      fontSize: '1rem',
      placeholderColor: '#6b7280', // placeholder-gray-500
      outline: 'none',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    inputDescription: {
      fontSize: '0.75rem', // text-xs
      color: '#9ca3af', // text-gray-500
      marginTop: '0.25rem', // mt-1
    },
    createButtonBase: {
      width: '100%',
      marginTop: '1.5rem', // mt-6
      padding: '0.75rem 1.5rem', // py-3 px-6
      fontSize: '1.125rem', // text-lg
      fontWeight: 600, // font-semibold
      borderRadius: '0.75rem', // rounded-xl
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    },
    createButtonEnabled: {
      background: 'linear-gradient(to right, #2563eb 0%, #7c3aed 100%)', // from-blue-600 to-purple-600
      color: '#ffffff',
    },
    createButtonDisabled: {
      backgroundColor: '#4b5563', // bg-gray-700
      color: '#9ca3af', // text-gray-400
      cursor: 'not-allowed',
    },
    errorBox: {
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: 'rgba(127, 29, 29, 0.3)', // bg-red-900/30
      border: '1px solid #dc2626', // border-red-700
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#f87171', // text-red-400
      fontSize: '0.875rem',
    },
    successCard: {
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: 'rgba(4, 120, 87, 0.3)', // bg-green-900/30
      border: '1px solid #059669', // border-green-700
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    },
    infoBox: {
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: '#1f2937', // bg-gray-800
      border: '1px solid #374151', // border-gray-700
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      color: '#d1d5db', // text-gray-300
    },
    footer: {
      maxWidth: '1280px',
      margin: '3rem auto 0', // mt-12
      paddingTop: '1.5rem', // pt-6
      borderTop: '1px solid #1f2937', // border-gray-800
      textAlign: 'center' as const,
      color: '#4b5563', // text-gray-600
      fontSize: '0.875rem',
    }
  };

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 1024;
  const gridStyle = isSmallScreen ? styles.grid : { ...styles.grid, ...styles['@media (min-width: 1024px)'].grid };

  return (
    <div style={styles.container}>
      {/* Header with wallet button */}
      <header style={{ ...styles.maxWidth, ...styles.header }}>
        <div style={{ ...styles.headerContent, flexDirection: isSmallScreen ? 'column' : 'row' }}>
          <div>
            <h1 style={styles.title}>
              Solana NFT Minter
            </h1>
            <p style={styles.subtitle}>
              Create Metaplex Standard NFTs using Umi
            </p>
          </div>
          {/* Wallet Connect Button */}
          <div style={{ marginTop: isSmallScreen ? '1rem' : '0' }}>
            <WalletMultiButton
              style={{
                background: 'linear-gradient(to right, #2563eb 0%, #7c3aed 100%)',
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          </div>
        </div>
      </header>

      <main style={styles.maxWidth}>
        <div style={gridStyle}>
          {/* Left Panel - NFT Preview */}
          <div style={styles.card}>
            <h2 style={styles.cardHeader}>
              <NftIcon /> NFT Preview
            </h2>

            {/* Preview Card */}
            <div style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(55, 65, 81, 0.5)', backgroundColor: 'rgba(23, 27, 33, 0.5)' }}>
              {/* Image */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom right, rgba(30, 64, 175, 0.5) 0%, rgba(109, 40, 217, 0.5) 100%)',
                  borderRadius: '0.75rem', filter: 'blur(1.5rem)', opacity: 0.5,
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

              {/* Details */}
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #1f2937' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ffffff' }}>{nftName || 'My NFT'}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>{nftSymbol ? `#${nftSymbol}` : '#NFT'}</p>
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'rgba(30, 64, 175, 0.5)', color: '#93c5fd', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500, border: '1px solid #1e40af' }}>
                    Metaplex Standard
                  </span>
                </div>

                <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {nftDescription || 'No description provided.'}
                </p>
              </div>

              {/* Attributes */}
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#e5e7eb' }}>Key Properties</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ padding: '0.25rem 0.75rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}>
                    <span style={{ color: '#9ca3af', display: 'block', fontSize: '0.75rem' }}>Creator</span>
                    <span style={{ fontWeight: 500, color: '#ffffff' }}>{shortAddress}</span>
                  </div>
                  <div style={{ padding: '0.25rem 0.75rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}>
                    <span style={{ color: '#9ca3af', display: 'block', fontSize: '0.75rem' }}>Royalties</span>
                    <span style={{ fontWeight: 500, color: '#ffffff' }}>0%</span>
                  </div>
                  <div style={{ padding: '0.25rem 0.75rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}>
                    <span style={{ color: '#9ca3af', display: 'block', fontSize: '0.75rem' }}>Mutable</span>
                    <span style={{ fontWeight: 500, color: '#ffffff' }}>Yes</span>
                  </div>
                </div>
              </div>

              {/* URI */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Metadata URI</div>
                <div style={{ color: '#ffffff', fontSize: '0.875rem', overflowWrap: 'break-word' }}>
                  {nftUri ? (
                    <a
                      href={nftUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#60a5fa', textDecoration: 'none', transition: 'color 0.3s ease' }}
                    >
                      {nftUri.length > 50 ? `${nftUri.slice(0, 50)}...` : nftUri}
                    </a>
                  ) : (
                    <span style={{ color: '#6b7280' }}>Not set</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Creation Form */}
          <div>
            {/* Wallet Status Card */}
            <div style={{ ...styles.card, marginBottom: '2rem' }}>
              <h2 style={{ ...styles.cardHeader, marginBottom: '1rem' }}>
                <WalletIcon /> Wallet Status
              </h2>

              <div style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: connected ? 'rgba(4, 120, 87, 0.3)' : 'rgba(146, 64, 14, 0.3)',
                border: connected ? '1px solid rgba(5, 150, 105, 0.5)' : '1px solid rgba(217, 119, 6, 0.5)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', marginRight: '0.75rem', backgroundColor: connected ? '#10b981' : '#f59e0b' }} />
                  <span style={{ fontWeight: 500 }}>
                    {connected ? 'Wallet Connected' : 'Please Connect Wallet'}
                  </span>
                </div>
                {publicKey && (
                  <button
                    onClick={() => copyToClipboard(publicKey.toBase58())}
                    style={{ padding: '0.5rem', backgroundColor: 'rgba(55, 65, 81, 0.5)', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                    title="Copy address"
                  >
                    <CopyIcon copied={copied} />
                  </button>
                )}
              </div>
            </div>

            {/* Creation Form Card */}
            <div style={styles.card}>
              <h2 style={styles.cardHeader}>
                NFT Metadata
              </h2>

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* NFT Name */}
                <div>
                  <label htmlFor="name" style={styles.inputLabel}>NFT Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    id="name"
                    type="text"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    placeholder="Enter NFT name (max 32 chars)"
                    maxLength={32}
                    style={styles.input}
                  />
                </div>

                {/* Symbol */}
                <div>
                  <label htmlFor="symbol" style={styles.inputLabel}>Symbol <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    id="symbol"
                    type="text"
                    value={nftSymbol}
                    onChange={(e) => setNftSymbol(e.target.value.toUpperCase())}
                    placeholder="e.g., MYNFT (max 10 chars)"
                    maxLength={10}
                    style={styles.input}
                  />
                </div>

                {/* Metadata URI */}
                <div>
                  <label htmlFor="uri" style={styles.inputLabel}>Metadata URI <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    id="uri"
                    type="text"
                    value={nftUri}
                    onChange={(e) => setNftUri(e.target.value)}
                    placeholder="https://your-metadata.json (Arweave/IPFS)"
                    style={styles.input}
                  />
                  <p style={styles.inputDescription}>URI pointing to your off-chain metadata JSON file.</p>
                </div>

                {/* Image URL (for preview only) */}
                <div>
                  <label htmlFor="image" style={styles.inputLabel}>Image URL (Preview)</label>
                  <input
                    id="image"
                    type="text"
                    value={nftImage}
                    onChange={(e) => setNftImage(e.target.value)}
                    placeholder="https://your-image.png"
                    style={styles.input}
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" style={styles.inputLabel}>Description (Optional)</label>
                  <textarea
                    id="description"
                    value={nftDescription}
                    onChange={(e) => setNftDescription(e.target.value)}
                    placeholder="Brief description of your NFT (max 200 chars)"
                    maxLength={200}
                    rows={3}
                    style={{ ...styles.input, minHeight: '4.5rem', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div style={styles.errorBox}>
                  <ErrorIcon />
                  <p style={{ margin: 0, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              {/* Create Button */}
              <button
                onClick={createNFT}
                disabled={!connected || isCreating}
                style={{
                  ...styles.createButtonBase,
                  ...(connected && !isCreating ? styles.createButtonEnabled : styles.createButtonDisabled)
                }}
                onMouseOver={(e) => {
                  if (connected && !isCreating) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (connected && !isCreating) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {isCreating ? 'Creating NFT... (Confirm in Wallet)' : 'Create NFT on Devnet'}
              </button>

              {/* Success Message */}
              {nftAddress && (
                <div style={styles.successCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <SuccessIcon />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#6ee7b7' }}>NFT Created!</h3>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>NFT Mint Address:</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#1f2937', borderRadius: '0.5rem', border: '1px solid rgba(55, 65, 81, 0.5)' }}>
                    <code style={{ fontSize: '0.875rem', color: '#60a5fa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '0.5rem' }}>{nftAddress}</code>
                    <button
                      onClick={() => copyToClipboard(nftAddress)}
                      style={{ padding: '0.375rem', backgroundColor: '#4b5563', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      title="Copy address"
                    >
                      <CopyIcon copied={copied} />
                    </button>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: '#1f2937', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Network</div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Solana Devnet</div>
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#1f2937', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Standard</div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Metaplex Token</div>
                    </div>
                  </div>

                  <button
                    onClick={() => viewOnExplorer(nftAddress)}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(30, 64, 175, 0.5)',
                      border: '1px solid #2563eb',
                      color: '#93c5fd',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <ExplorerIcon /> View on Explorer
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div style={styles.infoBox}>
                <p style={{ margin: 0 }}>
                  <strong>Note:</strong> This uses the Umi framework to call the
                  Metaplex Token Metadata program on **Solana Devnet**.
                  Ensure your connected wallet has Devnet SOL for transaction fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>Powered by Metaplex Umi & Solana Wallet Adapter</p>
      </footer>
    </div>
  );
};