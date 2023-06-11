const keys = [
    'QUICKNODE_HTTPS_ADDRESS',
    'ARB_API_ENDPOINT',
    'ARB_API_KEY_1',
    'BSC_SCAN_API_ENDPOINT',
    'BSC_API_KEY_1',
    'BSC_API_KEY_2',
    'BSC_API_KEY_3',
];

export default keys.reduce((acc, val) => ({ ...acc, [val]: process.env[val] }), {});
