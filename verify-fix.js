// verify-fix.js
// Run with: node verify-fix.js

async function verify() {
  const url = 'http://localhost:3000/api/projects';
  console.log(`Testing ${url}...`);

  try {
    // First request
    const start1 = Date.now();
    const res1 = await fetch(url);
    
    let data1;
    try {
      data1 = await res1.json();
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e);
      console.log('Response text:', await res1.text());
      return;
    }
    
    const time1 = Date.now() - start1;

    console.log('\n--- Request 1 ---');
    console.log('Status:', res1.status);
    console.log('Projects Count:', data1.projects ? data1.projects.length : '0');
    console.log('Time:', time1 + 'ms');

    if (res1.status !== 200) {
      console.error('❌ Failed: Status is not 200');
      // Check if it's the fallback data
      if (res1.headers.get('x-fallback')) {
        console.warn('⚠️ Serving fallback data (DB might be down, but app is up)');
      }
      return;
    }

    if (!data1.projects || data1.projects.length === 0) {
      console.warn('⚠️ Warning: No projects returned. Is the database empty?');
    }

    // Wait a sec
    await new Promise(r => setTimeout(r, 1000));

    // Second request
    const start2 = Date.now();
    const res2 = await fetch(url);
    const data2 = await res2.json();
    const time2 = Date.now() - start2;

    console.log('\n--- Request 2 (Should be fast) ---');
    console.log('Status:', res2.status);
    console.log('Projects Count:', data2.projects ? data2.projects.length : '0');
    console.log('Time:', time2 + 'ms');

    if (time2 < time1) {
      console.log('\n✅ Success: Second request was faster.');
    }

    console.log('\n✅ Verification Complete: The API is responding correctly.');
    console.log('   Monitor the Supabase dashboard to ensure connection count remains stable.');

  } catch (error) {
    console.error('❌ Error connecting to server. Make sure "npm run start" or "npm run dev" is running.');
    console.error('   Error details:', error.message);
  }
}

verify();
