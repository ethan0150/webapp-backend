## Setup environment
1. Install Deno from here: https://docs.deno.com/runtime/getting_started/installation/. NPM is also needed.
2. Fork this repo
3. Clone the fork
4. ```bash
   cd webapp-final
   deno install --allow-scripts=npm:prisma@6.0.0,npm:@prisma/engines@6.0.0
   ```
5. Try 
   ```bash
   deno run dev
   ```
   to start the backend (It's just a skeleton ATM)
6. Make PR to this repo for changes to be merged