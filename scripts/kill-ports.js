const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function killPorts() {
  try {
    console.log('Checking for processes on development ports...');
    
    // First, specifically target port 3000 as it's our primary development port
    try {
      const { stdout: port3000Output } = await execAsync('lsof -i :3000');
      const port3000Lines = port3000Output.split('\n').filter(line => line.trim());
      const port3000Pids = port3000Lines.slice(1).map(line => line.split(/\s+/)[1]);
      
      if (port3000Pids.length > 0) {
        console.log(`Found processes using port 3000: ${port3000Pids.join(', ')}`);
        
        for (const pid of port3000Pids) {
          if (pid) {
            try {
              await execAsync(`kill -9 ${pid}`);
              console.log(`Killed process ${pid} on port 3000`);
            } catch (error) {
              console.error(`Failed to kill process ${pid} on port 3000:`, error.message);
            }
          }
        }
      } else {
        console.log('No processes found on port 3000');
      }
    } catch (error) {
      if (error.message.includes('no process found')) {
        console.log('Port 3000 is already free');
      } else {
        console.error('Error checking port 3000:', error.message);
      }
    }
    
    // Then, check for any remaining processes on the range of development ports
    try {
      const { stdout } = await execAsync('lsof -i :3000-3009');
      
      // Parse the output to get PIDs
      const lines = stdout.split('\n').filter(line => line.trim());
      
      if (lines.length > 1) { // First line is header
        const pids = lines.slice(1).map(line => line.split(/\s+/)[1]);
        const uniquePids = [...new Set(pids)]; // Remove duplicates
        
        console.log(`Found processes using ports 3000-3009: ${uniquePids.join(', ')}`);
        
        // Kill each process
        for (const pid of uniquePids) {
          if (pid) {
            try {
              await execAsync(`kill -9 ${pid}`);
              console.log(`Killed process ${pid}`);
            } catch (error) {
              console.error(`Failed to kill process ${pid}:`, error.message);
            }
          }
        }
        
        console.log('Ports 3000-3009 are now free');
      } else {
        console.log('No processes found on ports 3000-3009');
      }
    } catch (error) {
      if (error.message.includes('no process found')) {
        console.log('All ports 3000-3009 are already free');
      } else {
        console.error('Error killing processes:', error.message);
      }
    }
    
    // Verify port 3000 is now free
    try {
      await execAsync('lsof -i :3000');
      console.error('WARNING: Port 3000 is still in use after attempts to free it!');
      console.error('You may need to manually kill the process using this port.');
    } catch (error) {
      if (error.message.includes('no process found')) {
        console.log('Verified: Port 3000 is free and ready for use');
      } else {
        console.error('Error verifying port 3000:', error.message);
      }
    }
  } catch (error) {
    console.error('Unexpected error in kill-ports script:', error.message);
  }
}

killPorts(); 