/**
 * Utility for registering Quill modules
 */

// Flag to track if modules have been registered
let modulesRegistered = false;

/**
 * Register Quill table modules
 * This function ensures modules are only registered once
 * @returns Promise that resolves when modules are registered
 */
export const registerQuillModules = async (): Promise<void> => {
  // Only register once
  if (modulesRegistered) return Promise.resolve();
  
  // Only run in browser environment
  if (typeof window === 'undefined') return Promise.resolve();
  
  return new Promise<void>((resolve, reject) => {
    try {
      // Import modules
      Promise.all([
        import('quill-table'),
        import('quill-table-ui')
      ]).then(([{ tableModule }, { tableUI }]) => {
        // Function to register modules when Quill is available
        const registerModules = () => {
          if (window.Quill) {
            try {
              // Register modules
              window.Quill.register({
                'modules/table': tableModule,
                'modules/tableUI': tableUI
              }, true);
              
              // Set flag to prevent re-registration
              modulesRegistered = true;
              console.log('Quill table modules registered successfully');
              resolve();
            } catch (err) {
              console.error('Error registering Quill modules:', err);
              reject(err);
            }
          } else {
            // If Quill isn't available yet, try again after a short delay
            console.log('Waiting for Quill to be available...');
            setTimeout(registerModules, 100);
          }
        };
        
        // Start the registration process
        if (document.readyState === 'complete') {
          registerModules();
        } else {
          window.addEventListener('DOMContentLoaded', registerModules);
        }
      }).catch(error => {
        console.error('Error importing Quill modules:', error);
        reject(error);
      });
    } catch (error) {
      console.error('Error loading Quill modules:', error);
      reject(error);
    }
  });
};