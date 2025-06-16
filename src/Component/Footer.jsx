export default function Footer() {
    return (
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