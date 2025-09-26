/**
 * Stub implementation of Node.js path module for browser compatibility
 * Provides basic path manipulation functions
 */

// Implementasi fungsi join terlebih dahulu
function joinPaths(...segments) {
  if (segments.length === 0) {
    return '.';
  }
  
  // Filter out empty, null, or undefined segments
  const validSegments = segments.filter(segment => 
    segment != null && segment !== ''
  ).map(segment => String(segment));
  
  if (validSegments.length === 0) {
    return '.';
  }
  
  return validSegments.join('/').replace(/\/+/g, '/');
}

// Define the path object
const path = {
  /**
   * Parse a path string and return an object with path components
   * @param {string} pathString - Path to parse
   * @returns {object} Object with dir, root, base, name, ext properties
   */
  parse: function(pathString) {
    if (typeof pathString !== 'string') {
      return { root: '', dir: '', base: '', ext: '', name: '' };
    }
    
    const isAbsolute = pathString.startsWith('/');
    const parts = pathString.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1] || '';
    
    const dotIndex = lastPart.lastIndexOf('.');
    const hasExt = dotIndex > 0;
    
    return {
      root: isAbsolute ? '/' : '',
      dir: isAbsolute ? '/' + parts.slice(0, -1).join('/') : parts.slice(0, -1).join('/'),
      base: lastPart,
      ext: hasExt ? lastPart.substring(dotIndex) : '',
      name: hasExt ? lastPart.substring(0, dotIndex) : lastPart
    };
  },

  /**
   * Join path segments together
   * @param {...string} segments - Path segments to join
   * @returns {string} Joined path
   */
  join: joinPaths,

  /**
   * Resolve path segments to an absolute path
   * Mimics Node.js behavior: combines from right to left, stops at absolute path, normalizes . and ..
   * @param {...string} segments - Path segments to resolve
   * @returns {string} Resolved absolute path
   */
  resolve: function(...segments) {
    let resolvedPath = '';
    let resolvedAbsolute = false;
    
    // Process segments from right to left (like Node.js)
    for (let i = segments.length - 1; i >= 0 && !resolvedAbsolute; i--) {
      const segment = segments[i];
      
      if (segment == null || segment === '') {
        continue;
      }
      
      const path = String(segment);
      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charAt(0) === '/';
    }
    
    // If no absolute path found, prepend current working directory (/)
    if (!resolvedAbsolute) {
      resolvedPath = '/' + resolvedPath;
    }
    
    // Normalize the path (handle . and ..)
    return this.normalize(resolvedPath) || '/';
  },

  /**
   * Get directory name of a path
   * @param {string} pathString - Path to get directory from
   * @returns {string} Directory name
   */
  dirname: function(pathString) {
    if (typeof pathString !== 'string') {
      return '.';
    }
    
    const parsed = this.parse(pathString);
    return parsed.dir || '.';
  },

  /**
   * Get base name of a path
   * @param {string} pathString - Path to get base name from
   * @param {string} ext - Optional extension to remove
   * @returns {string} Base name
   */
  basename: function(pathString, ext) {
    if (typeof pathString !== 'string') {
      return '';
    }
    
    const parsed = this.parse(pathString);
    let base = parsed.base;
    
    if (ext && base.endsWith(ext)) {
      base = base.slice(0, -ext.length);
    }
    
    return base;
  },

  /**
   * Get extension of a path
   * @param {string} pathString - Path to get extension from
   * @returns {string} Extension including the dot
   */
  extname: function(pathString) {
    if (typeof pathString !== 'string') {
      return '';
    }
    
    return this.parse(pathString).ext;
  },

  /**
   * Normalize a path
   * Handles . and .. segments like Node.js, not just regex replacement
   * @param {string} pathString - Path to normalize
   * @returns {string} Normalized path
   */
  normalize: function(pathString) {
    if (typeof pathString !== 'string') {
      return '.';
    }
    
    if (pathString === '') {
      return '.';
    }
    
    const isAbsolute = pathString.startsWith('/');
    const trailingSlash = pathString.endsWith('/') && pathString.length > 1;
    
    // Split path into segments and filter out empty ones
    const segments = pathString.split('/').filter(segment => segment !== '');
    const normalizedSegments = [];
    
    for (const segment of segments) {
      if (segment === '..') {
        // Go up one directory (remove last segment if not at root)
        if (normalizedSegments.length > 0 && normalizedSegments[normalizedSegments.length - 1] !== '..') {
          normalizedSegments.pop();
        } else if (!isAbsolute) {
          // Only add .. if we're not at absolute root
          normalizedSegments.push('..');
        }
      } else if (segment !== '.') {
        // Add segment (ignore current directory references)
        normalizedSegments.push(segment);
      }
    }
    
    // Reconstruct path
    let result = normalizedSegments.join('/');
    
    if (isAbsolute) {
      result = '/' + result;
    } else if (result === '') {
      result = '.';
    }
    
    // Add trailing slash if original had one
    if (trailingSlash && result !== '/') {
      result += '/';
    }
    
    return result;
  },

  /**
   * Check if path is absolute
   * @param {string} pathString - Path to check
   * @returns {boolean} True if absolute
   */
  isAbsolute: function(pathString) {
    return typeof pathString === 'string' && pathString.startsWith('/');
  },

  /**
   * Get relative path from one path to another
   * Calculates the relative path from 'from' to 'to' like Node.js
   * @param {string} from - From path
   * @param {string} to - To path
   * @returns {string} Relative path
   */
  relative: function(from, to) {
    if (typeof from !== 'string' || typeof to !== 'string') {
      return '';
    }
    
    if (from === to) {
      return '';
    }
    
    // Resolve both paths to absolute paths
    const resolvedFrom = this.resolve(from);
    const resolvedTo = this.resolve(to);
    
    if (resolvedFrom === resolvedTo) {
      return '';
    }
    
    // Split paths into segments
    const fromSegments = resolvedFrom.split('/').filter(segment => segment !== '');
    const toSegments = resolvedTo.split('/').filter(segment => segment !== '');
    
    // Find common base
    let commonLength = 0;
    const minLength = Math.min(fromSegments.length, toSegments.length);
    
    for (let i = 0; i < minLength; i++) {
      if (fromSegments[i] === toSegments[i]) {
        commonLength++;
      } else {
        break;
      }
    }
    
    // Calculate relative path
    const upSegments = fromSegments.length - commonLength;
    const downSegments = toSegments.slice(commonLength);
    
    // Build relative path
    const relativeParts = [];
    
    // Add .. for each directory to go up
    for (let i = 0; i < upSegments; i++) {
      relativeParts.push('..');
    }
    
    // Add remaining segments from target path
    relativeParts.push(...downSegments);
    
    const result = relativeParts.join('/');
    return result || '.';
  },

  // Path separator
  sep: '/',
  
  // Path delimiter
  delimiter: ':',

  // Add all method to handle Next.js internal usage
  all: function(paths) {
    if (!Array.isArray(paths)) {
      return '';
    }
    
    // Ensure all elements are valid before joining
    const validPaths = paths.filter(p => p != null && p !== '');
    if (validPaths.length === 0) {
      return '';
    }
    
    // Use the standalone join function
    return joinPaths(...validPaths);
  }
};

/**
 * ROBUST HACK: Function.all for Next.js internal compatibility
 * 
 * This provides a robust implementation with comprehensive error handling
 * to prevent runtime errors in Next.js Turbopack environment.
 * 
 * WARNING: This modifies the global Function prototype.
 * Use with caution in production environments.
 */
// Disable Function.all hack as it conflicts with Next.js internal implementation
// if (typeof Function !== 'undefined' && typeof globalThis !== 'undefined') {
//   console.log('Function.all hack applied');
//   
//   // Store original Function.all if it exists
//   const originalFunctionAll = Function.all;
//   
//   Function.all = function (arr) {
//     // Handle various edge cases that might cause runtime errors
//     if (arr === null || arr === undefined) {
//       console.warn('Function.all: received null or undefined argument');
//       return '';
//     }
//     
//     // If not an array, try to convert or return empty string
//     if (!Array.isArray(arr)) {
//       console.warn('Function.all: argument is not an array, type:', typeof arr);
//       // Try to handle string arguments that might be passed
//       if (typeof arr === 'string') return arr;
//       return '';
//     }
//     
//     try {
//       // Ensure we have a valid array and filter returns an array
//       const filtered = arr.filter(function(item) {
//         return item != null && item !== '' && item !== false;
//       });
//       
//       // Triple-check filtered is still an array and has join method
//       if (!Array.isArray(filtered)) {
//         console.warn('Function.all: filter result is not an array');
//         return '';
//       }
//       
//       if (typeof filtered.join !== 'function') {
//         console.warn('Function.all: filtered array does not have join method');
//         return '';
//       }
//       
//       return filtered.join('/');
//     } catch (error) {
//       // Fallback in case of any unexpected error
//       console.warn('Function.all error:', error);
//       
//       // Try to call original function if it exists
//       if (originalFunctionAll && typeof originalFunctionAll === 'function') {
//         try {
//           return originalFunctionAll.call(this, arr);
//         } catch (originalError) {
//           console.warn('Function.all: original function also failed:', originalError);
//         }
//       }
//       
//       return '';
//     }
//   };
// }

// Export sebagai default dan named export untuk kompatibilitas
module.exports = path;
module.exports.default = path;