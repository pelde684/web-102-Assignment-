const formatResponse = (req, res, next) => {
    const originalJson = res.json; // Store original res.json method

    res.json = function (obj) { // Override res.json
        const acceptHeader = req.headers.accept; // Check accept header

        if (acceptHeader && acceptHeader.includes('application/xml')) {

            const convertToXml = (obj) => {
                let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<response>\n`;

                for (const key in obj) {

                    if (Array.isArray(obj[key])) {
                        xml += `<${key}>\n`;

                        obj[key].forEach(item => {
                            xml += `<item>\n`;

                            for (const subKey in item) {
                                xml += `<${subKey}>${item[subKey]}</${subKey}>\n`;
                            }

                            xml += `</item>\n`;
                        });

                        xml += `</${key}>\n`;

                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {

                        xml += `<${key}>\n`;

                        for (const subKey in obj[key]) {
                            xml += `<${subKey}>${obj[key][subKey]}</${subKey}>\n`;
                        }

                        xml += `</${key}>\n`;

                    } else {
                        xml += `<${key}>${obj[key]}</${key}>\n`;
                    }
                }

                xml += `</response>`;
                return xml;
            };

            res.set('Content-Type', 'application/xml');

            return res.send(convertToXml(obj));

        } else {
            res.set('Content-Type', 'application/json');
            return originalJson.call(this, obj);
        }
    };

    next();
};

module.exports = formatResponse;