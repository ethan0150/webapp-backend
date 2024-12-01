## Setup environment
1. Install Deno from here: https://docs.deno.com/runtime/getting_started/installation/. NPM is also needed.
2. Clone this repo
3. ```bash
   cd webapp-final
   deno install --allow-scripts=npm:prisma@6.0.0,npm:@prisma/engines@6.0.0
   ```
4. Try 
   ```bash
   deno run dev
   ```
   to start the backend (It's just a skeleton ATM)