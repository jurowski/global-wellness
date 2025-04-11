const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function killPorts() {
  try {
    // Get the list of processes using ports 3000-3009
    const { stdout } = await execAsync('lsof -i :3000-3009');
    
    // Parse the output to get PIDs
    const lines = stdout.split('\n').filter(line => line.trim());
    const pids = lines.slice(1).map(line => line.split(/\s+/)[1]);
    
    // Kill each process
    for (const pid of pids) {
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
  } catch (error) {
    if (error.message.includes('no process found')) {
      console.log('No processes found on ports 3000-3009');
    } else {
      console.error('Error killing processes:', error.message);
    }
  }
}

killPorts(); 