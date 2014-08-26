/**
 * Detect Development Environment On Client-Side, in case you need to know
 */
var environment = $('#dashboard-container').attr('data-dashboard');
if (environment === 'development') { console.log('Environment: Development'); }


/**
 * Instantiate Servant SDK
 */
var servant_access_token = $('#dashboard-container').attr('data-accesstoken');
servant = new Servant(0, servant_access_token);

/**
 * Register Archetypes To Use
 */
var productSchema = {
	"$schema": "http://json-schema.org/draft-04/schema#",
	"title": "Product Schema",
	"description": "The Product Archetype - Essential properties that define a product",
	"type": "object",
	"additionalProperties": false,
	"required": ["title", "price", "seller"],
	"properties": {
		"title": {
			"type": "string",
			"description": "The name of the product",
			"maxLength": 140,
			"default": ""
		},
		"price": {
			"type": "integer",
			"description": "Product price in cents as an integer (whole number)",
			"minimum": 0,
			"maximum": 999999999999999,
			"default": 0
		},
		"seller": {
			"type": "string",
			"description": "The person or organization selling the product",
			"maxLength": 70,
			"default": ""
		},
		"category": {
			"type": "string",
			"description": "General category of the product, e.g. Clothing",
			"maxLength": 40,
			"default": ""
		},
		"subcategory": {
			"type": "string",
			"description": "Specific category of the product, e.g. Jeans",
			"maxLength": 40,
			"default": ""
		},
		"condition": {
			"enum": ["new", "refurbished", "used - like new", "used - very good", "used - good", "used - acceptable"],
			"description": "Condition of the product, e.g. New",
			"default": "new"
		},
		"description": {
			"type": "string",
			"description": "Description of the product",
			"maxLength": 5000,
			"default": ""
		},
		"images": {
			"type": "array",
			"description": "Product images with consistent resolutions",
			"uniqueItems": true,
			"additionalItems": false,
			"default": [],
			"maxItems": 15,
			"items": {
				"type": "object",
				"additionalProperties": false,
				"properties": {
					"image_original": {
						"type": "string",
						"description": "URL (as per RFC 3986) to a picture in JPEG or PNG format at the original resolution it had when it was uploaded",
						"default": ""
					},
					"image_large": {
						"type": "string",
						"description": "URL (as per RFC 3986) to a picture in JPEG or PNG format at large resolution (640px x 640px)",
						"default": ""
					},
					"image_medium": {
						"type": "string",
						"description": "URL (as per RFC 3986) to a picture in JPEG or PNG format at medium resolution (240px x 240px)",
						"default": ""
					},
					"image_small": {
						"type": "string",
						"description": "URL (as per RFC 3986) to a picture in JPEG or PNG format at large resolution (64px x 64px)",
						"default": ""
					}
				}
			}
		},
		"variations": {
			"type": "array",
			"description": "Variations of this product that can be ordered for the same price, e.g. Color.",
			"uniqueItems": true,
			"additionalItems": false,
			"maxItems": 15,
			"default": [],
			"items": {
				"type": "object",
				"additionalProperties": false,
				"required": ["variation_title", "variation_in_stock"],
				"properties": {
					"variation_title": {
						"type": "string",
						"description": "Title or simple description of the variation",
						"maxLength": 100,
						"default": ""
					},
					"variation_in_stock": {
						"type": "boolean",
						"description": "Whether this specific variation is in stock or not",
						"default": true
					}
				}
			}
		},
		"tags": {
			"type": "array",
			"maxItems": 6,
			"uniqueItems": true,
			"default": [],
			"items": {
				"type": "string",
				"maxLength": 30,
				"default": ""
			}
		},
		"audience": {
			"type": "array",
			"maxItems": 4,
			"uniqueItems": true,
			"default": [],
			"items": {
				"type": "string",
				"maxLength": 30,
				"default": ""
			}
		},
		"brand": {
			"type": "string",
			"description": "Brand of the product",
			"maxLength": 50,
			"default": ""
		},
		"model": {
			"type": "string",
			"description": "Model name or number of the product",
			"maxLength": 50,
			"default": ""
		},
		"currency": {
			"enum": ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "USS", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XFU", "XOF", "XPD", "XPF", "XPT", "XTS", "XXX", "YER", "ZAR", "ZMW"],
			"description": "ISO 4217 currency code",
			"default": "USD"
		},
		"recurring_payment": {
			"type": "boolean",
			"description": "Does this product require recurring payments, e.g. Subscriptions",
			"default": false
		},
		"payment_interval": {
			"enum": ["yearly", "monthly", "weekly", "daily", "hourly"],
			"description": "Time interval for recurring payment",
			"default": "yearly"
		},
		"sale": {
			"type": "boolean",
			"description": "Is the product on sale",
			"default": false
		},
		"sale_price": {
			"type": "integer",
			"description": "Product price in cents as an integer (whole number)",
			"minimum": 0,
			"maximum": 999999999999999,
			"default": 0
		},
		"in_stock": {
			"type": "boolean",
			"description": "Is the product in stock?",
			"default": true
		},
		"sku": {
			"type": "string",
			"description": "The Stock Keeping Unit of the product",
			"maxLength": 50,
			"default": ""
		},
		"upc": {
			"type": "string",
			"description": "The Universal Product Code of the product",
			"maxLength": 50,
			"default": ""
		},
		"shipping_prices": {
			"type": "array",
			"description": "An array listing countries or states the product ships to and the corresponding price",
			"uniqueItems": true,
			"additionalItems": false,
			"default": [],
			"maxItems": 60,
			"items": {
				"type": "object",
				"additionalProperties": false,
				"required": ["shipping_place", "shipping_price"],
				"properties": {
					"shipping_place": {
						"enum": ["everywhere else", "afghanistan", "albania", "algeria", "andorra", "angola", "anguilla", "antigua & barbuda", "argentina", "armenia", "aruba", "australia", "austria", "azerbaijan", "bahamas", "bahrain", "bangladesh", "barbados", "belarus", "belgium", "belize", "benin", "bermuda", "bhutan", "bolivia", "bosnia &amp; herzegovina", "botswana", "brazil", "british virgin islands", "brunei", "bulgaria", "burkina faso", "burundi", "canada", "cambodia", "cameroon", "cape verde", "cayman islands", "chad", "chile", "china", "colombia", "congo", "cook islands", "costa rica", "cote d ivoire", "croatia", "cruise ship", "cuba", "cyprus", "czech republic", "denmark", "djibouti", "dominica", "dominican republic", "ecuador", "egypt", "el salvador", "equatorial guinea", "estonia", "ethiopia", "falkland islands", "faroe islands", "fiji", "finland", "france", "french polynesia", "french west indies", "gabon", "gambia", "georgia", "germany", "ghana", "gibraltar", "greece", "greenland", "grenada", "guam", "guatemala", "guernsey", "guinea", "guinea bissau", "guyana", "haiti", "honduras", "hong kong", "hungary", "iceland", "india", "indonesia", "iran", "iraq", "ireland", "isle of man", "israel", "italy", "jamaica", "japan", "jersey", "jordan", "kazakhstan", "kenya", "kuwait", "kyrgyz republic", "laos", "latvia", "lebanon", "lesotho", "liberia", "libya", "liechtenstein", "lithuania", "luxembourg", "macau", "macedonia", "madagascar", "malawi", "malaysia", "maldives", "mali", "malta", "mauritania", "mauritius", "mexico", "moldova", "monaco", "mongolia", "montenegro", "montserrat", "morocco", "mozambique", "namibia", "nepal", "netherlands", "netherlands antilles", "new caledonia", "new zealand", "nicaragua", "niger", "nigeria", "norway", "oman", "pakistan", "palestine", "panama", "papua new guinea", "paraguay", "peru", "philippines", "poland", "portugal", "puerto rico", "qatar", "reunion", "romania", "russia", "rwanda", "saint pierre &amp; miquelon", "samoa", "san marino", "satellite", "saudi arabia", "senegal", "serbia", "seychelles", "sierra leone", "singapore", "slovakia", "slovenia", "south africa", "south korea", "spain", "sri lanka", "st kitts &amp; nevis", "st lucia", "st vincent", "st. lucia", "sudan", "suriname", "swaziland", "sweden", "switzerland", "syria", "taiwan", "tajikistan", "tanzania", "thailand", "timor l'este", "togo", "tonga", "trinidad &amp; tobago", "tunisia", "turkey", "turkmenistan", "turks &amp; caicos", "uganda", "ukraine", "united arab emirates", "united kingdom", "united states", "united states minor outlying islands", "uruguay", "uzbekistan", "venezuela", "vietnam", "virgin islands (us)", "yemen", "zambia", "zimbabwe"],
						"description": "Name of the geographic jurisdiction which the product can be shipped to",
						"default": "united states"
					},
					"shipping_price": {
						"type": "integer",
						"description": "The price of shipping to the corresponding place in cents as an integer (whole number)",
						"minimum": 0,
						"default": 0
					}
				}
			}
		}
	}
};

// Register Schema
servant.addArchetype('product', productSchema);


// End