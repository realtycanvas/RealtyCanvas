const https = require('https');

const token = 'skO8BVVIDpG6KcxGfTFqLoT5TQGBZIKyprXFI4zoVMWyptrAbzCM7054eQUGJ3OpJcEeZVkPKmbPUbDUkMw4XI56Elf24cJnargrkg4jqGt12HbPn0kHVUIkj955N29AYCizcp9zDVmVmHR4D4Sk5LXPI9FhSRHHocQD7dbSR2RMuxgNnmV1';

const options = {
    hostname: 'api.sanity.io',
    port: 443,
    path: '/v1/users/me',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'SanityTokenVerifier/1.0'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Body:', data);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.end();
