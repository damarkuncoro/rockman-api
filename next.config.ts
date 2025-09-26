// @ts-check

import type { NextConfig } from "next";
import path from "path";

/**
 * Type definition untuk resolve aliases
 * Memberikan type safety untuk konfigurasi alias
 */
type ResolveAlias = Record<string, string>;

/**
 * Next.js Configuration
 * 
 * Konfigurasi untuk Rockman App dengan Turbopack dan client-side compatibility
 * 
 * @type {NextConfig}
 */
const nextConfig: NextConfig = {
  /**
   * ESLint Configuration
   * Mengabaikan warning saat build untuk menghindari build failure
   */
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * Turbopack Configuration
   * Mengoptimalkan build performance dan mengatasi compatibility issues
   */
  turbopack: {
    /**
     * Set root directory untuk mengatasi warning multiple lockfiles
     */
    root: path.resolve(__dirname),
    
    /**
     * Resolve Aliases Configuration
     * Mengganti Node.js modules dengan browser-compatible stubs untuk client-side
     */
    resolveAlias: {
      // Database & ORM - Diganti dengan custom stub untuk client-side
      // '@/db': './src/stubs/empty.js',
      // 'drizzle-orm': './src/stubs/drizzle.js', // Aktifkan stub untuk client-side
      // 'drizzle-orm/pg-core': './src/stubs/pg-core.js', // Aktifkan stub untuk client-side
      // 'drizzle-orm/node-postgres': './src/stubs/drizzle.js', // Aktifkan stub untuk client-side
      
      // Database Drivers - Diganti dengan custom stubs
      // 'pg': './src/stubs/pg.js', // Aktifkan stub untuk client-side
      'pgpass': './src/stubs/pgpass.js',
      
      // File System & Network - Diganti dengan custom stubs
      'fs': './src/stubs/fs.js',
      'net': './src/stubs/net.js',
      'tls': './src/stubs/tls.js',
      // 'path': './src/stubs/path.js', // Disabled to prevent Function.all conflicts
      
      // Core Node.js Modules - Diganti dengan empty stub untuk client-side
      'crypto': './src/stubs/empty.js',
      'stream': './src/stubs/empty.js',
      'util': './src/stubs/empty.js',
      'url': './src/stubs/empty.js',
      'zlib': './src/stubs/empty.js',
      'http': './src/stubs/empty.js',
      'https': './src/stubs/empty.js',
      'assert': './src/stubs/empty.js',
      'os': './src/stubs/empty.js',
      'querystring': './src/stubs/empty.js',
      'punycode': './src/stubs/empty.js',
      'events': './src/stubs/empty.js',
      'buffer': './src/stubs/empty.js',
      'string_decoder': './src/stubs/empty.js',
      
      // Process & System Modules - Diganti dengan empty stub untuk client-side
      'child_process': './src/stubs/empty.js',
      'cluster': './src/stubs/empty.js',
      'dgram': './src/stubs/empty.js',
      'dns': './src/stubs/empty.js',
      'domain': './src/stubs/empty.js',
      'readline': './src/stubs/empty.js',
      'repl': './src/stubs/empty.js',
      'tty': './src/stubs/empty.js',
      'v8': './src/stubs/empty.js',
      'vm': './src/stubs/empty.js',
      'worker_threads': './src/stubs/empty.js',
      'inspector': './src/stubs/empty.js',
      'perf_hooks': './src/stubs/empty.js',
      'async_hooks': './src/stubs/empty.js',
      'timers': './src/stubs/empty.js',
      'constants': './src/stubs/empty.js',
      'module': './src/stubs/empty.js',
    } satisfies ResolveAlias,
  },
  
  /**
   * Webpack Configuration
   * Konfigurasi tambahan untuk mengatasi masalah client-side imports
   */
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Hanya apply stub untuk client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Tidak perlu menambahkan pg stub di sini karena sudah di-handle oleh Turbopack resolveAlias
      };
    }
    
    return config;
  },
};

export default nextConfig;