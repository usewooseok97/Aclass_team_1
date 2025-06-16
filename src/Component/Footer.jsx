export default function Footer({ type }) {
    return type ? (
        <footer className="bg-gray-100 border-t border-gray-200 text-center text-sm text-gray-600 py-4">
            <div className="text-center text-gray-500 text-xs">
                © 2025 Seoul Festa @ Aclass_team
            </div>
        </footer>
    ) : (
        <footer
            style={{
                width: '100%',
                height: '60px',
                padding: '10px',
                backgroundColor: 'transparent',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div style={{ fontSize: '13px', color: '#888', textAlign: 'center' }}>
                © 2025 Seoul Festa @ Aclass_team
            </div>
        </footer>
    );
}