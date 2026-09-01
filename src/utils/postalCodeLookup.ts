export interface PostalLookupResult {
  city: string;
  state: string;
  country?: string;
  district?: string;
  source: 'local_instant' | 'api_live';
}

// Comprehensive fast offline dictionary of popular PIN codes & ZIP codes
const LOCAL_POSTAL_DB: Record<string, { city: string; state: string; country: string; district?: string }> = {
  // India Major Metros & Cities (6-Digit PIN Codes)
  '400001': { city: 'Mumbai', state: 'Maharashtra', country: 'India', district: 'Mumbai South' },
  '400050': { city: 'Mumbai', state: 'Maharashtra', country: 'India', district: 'Bandra West' },
  '400051': { city: 'Mumbai', state: 'Maharashtra', country: 'India', district: 'Bandra East / BKC' },
  '400053': { city: 'Mumbai', state: 'Maharashtra', country: 'India', district: 'Andheri West' },
  '400069': { city: 'Mumbai', state: 'Maharashtra', country: 'India', district: 'Andheri East' },
  '400076': { city: 'Mumbai', state: 'Maharashtra', country: 'India', district: 'Powai' },
  '400092': { city: 'Mumbai', state: 'Maharashtra', country: 'India', district: 'Borivali West' },
  '400601': { city: 'Thane', state: 'Maharashtra', country: 'India', district: 'Thane' },
  '400703': { city: 'Navi Mumbai', state: 'Maharashtra', country: 'India', district: 'Vashi' },
  '411001': { city: 'Pune', state: 'Maharashtra', country: 'India', district: 'Pune City' },
  '411014': { city: 'Pune', state: 'Maharashtra', country: 'India', district: 'Viman Nagar' },
  '411045': { city: 'Pune', state: 'Maharashtra', country: 'India', district: 'Baner' },
  '411057': { city: 'Pune', state: 'Maharashtra', country: 'India', district: 'Hinjewadi IT Park' },
  '440001': { city: 'Nagpur', state: 'Maharashtra', country: 'India', district: 'Nagpur' },
  '422001': { city: 'Nashik', state: 'Maharashtra', country: 'India', district: 'Nashik' },
  '431001': { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', country: 'India', district: 'Aurangabad' },

  // Delhi NCR
  '110001': { city: 'New Delhi', state: 'Delhi', country: 'India', district: 'Connaught Place' },
  '110003': { city: 'New Delhi', state: 'Delhi', country: 'India', district: 'Lodhi Road' },
  '110016': { city: 'New Delhi', state: 'Delhi', country: 'India', district: 'Hauz Khas' },
  '110020': { city: 'New Delhi', state: 'Delhi', country: 'India', district: 'Okhla' },
  '110034': { city: 'New Delhi', state: 'Delhi', country: 'India', district: 'Saraswati Vihar' },
  '110092': { city: 'New Delhi', state: 'Delhi', country: 'India', district: 'Laxmi Nagar' },
  '122001': { city: 'Gurugram', state: 'Haryana', country: 'India', district: 'Gurgaon' },
  '122002': { city: 'Gurugram', state: 'Haryana', country: 'India', district: 'Cyber City DLF' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', country: 'India', district: 'Gautam Buddha Nagar' },
  '201001': { city: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', district: 'Ghaziabad' },
  '121001': { city: 'Faridabad', state: 'Haryana', country: 'India', district: 'Faridabad' },

  // Karnataka
  '560001': { city: 'Bengaluru', state: 'Karnataka', country: 'India', district: 'MG Road / Central' },
  '560034': { city: 'Bengaluru', state: 'Karnataka', country: 'India', district: 'Koramangala' },
  '560038': { city: 'Bengaluru', state: 'Karnataka', country: 'India', district: 'Indiranagar' },
  '560066': { city: 'Bengaluru', state: 'Karnataka', country: 'India', district: 'Whitefield' },
  '560100': { city: 'Bengaluru', state: 'Karnataka', country: 'India', district: 'Electronic City' },
  '570001': { city: 'Mysuru', state: 'Karnataka', country: 'India', district: 'Mysore' },
  '575001': { city: 'Mangaluru', state: 'Karnataka', country: 'India', district: 'Dakshina Kannada' },

  // Tamil Nadu
  '600001': { city: 'Chennai', state: 'Tamil Nadu', country: 'India', district: 'George Town' },
  '600018': { city: 'Chennai', state: 'Tamil Nadu', country: 'India', district: 'Teynampet' },
  '600028': { city: 'Chennai', state: 'Tamil Nadu', country: 'India', district: 'R.A. Puram' },
  '600096': { city: 'Chennai', state: 'Tamil Nadu', country: 'India', district: 'OMR IT Corridor' },
  '641001': { city: 'Coimbatore', state: 'Tamil Nadu', country: 'India', district: 'Coimbatore' },
  '625001': { city: 'Madurai', state: 'Tamil Nadu', country: 'India', district: 'Madurai' },

  // Telangana & Andhra Pradesh
  '500001': { city: 'Hyderabad', state: 'Telangana', country: 'India', district: 'Hyderabad GPO' },
  '500034': { city: 'Hyderabad', state: 'Telangana', country: 'India', district: 'Banjara Hills' },
  '500081': { city: 'Hyderabad', state: 'Telangana', country: 'India', district: 'HITEC City' },
  '530001': { city: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', district: 'Vizag' },
  '520001': { city: 'Vijayawada', state: 'Andhra Pradesh', country: 'India', district: 'Krishna' },

  // West Bengal
  '700001': { city: 'Kolkata', state: 'West Bengal', country: 'India', district: 'BBD Bagh' },
  '700019': { city: 'Kolkata', state: 'West Bengal', country: 'India', district: 'Ballygunge' },
  '700091': { city: 'Kolkata', state: 'West Bengal', country: 'India', district: 'Salt Lake Sector V' },
  '734001': { city: 'Siliguri', state: 'West Bengal', country: 'India', district: 'Darjeeling' },

  // Gujarat
  '380001': { city: 'Ahmedabad', state: 'Gujarat', country: 'India', district: 'Ahmedabad City' },
  '380015': { city: 'Ahmedabad', state: 'Gujarat', country: 'India', district: 'Satellite / SG Highway' },
  '395001': { city: 'Surat', state: 'Gujarat', country: 'India', district: 'Surat' },
  '390001': { city: 'Vadodara', state: 'Gujarat', country: 'India', district: 'Vadodara' },
  '360001': { city: 'Rajkot', state: 'Gujarat', country: 'India', district: 'Rajkot' },

  // Rajasthan
  '302001': { city: 'Jaipur', state: 'Rajasthan', country: 'India', district: 'Pink City' },
  '302017': { city: 'Jaipur', state: 'Rajasthan', country: 'India', district: 'Malviya Nagar' },
  '342001': { city: 'Jodhpur', state: 'Rajasthan', country: 'India', district: 'Jodhpur' },
  '313001': { city: 'Udaipur', state: 'Rajasthan', country: 'India', district: 'Udaipur' },

  // Kerala
  '682001': { city: 'Kochi', state: 'Kerala', country: 'India', district: 'Ernakulam' },
  '695001': { city: 'Thiruvananthapuram', state: 'Kerala', country: 'India', district: 'Trivandrum' },
  '673001': { city: 'Kozhikode', state: 'Kerala', country: 'India', district: 'Calicut' },

  // Uttar Pradesh & Bihar & Others
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', district: 'Hazratganj' },
  '208001': { city: 'Kanpur', state: 'Uttar Pradesh', country: 'India', district: 'Kanpur Nagar' },
  '221001': { city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', district: 'Varanasi' },
  '282001': { city: 'Agra', state: 'Uttar Pradesh', country: 'India', district: 'Agra' },
  '800001': { city: 'Patna', state: 'Bihar', country: 'India', district: 'Patna' },
  '834001': { city: 'Ranchi', state: 'Jharkhand', country: 'India', district: 'Ranchi' },
  '751001': { city: 'Bhubaneswar', state: 'Odisha', country: 'India', district: 'Khordha' },
  '781001': { city: 'Guwahati', state: 'Assam', country: 'India', district: 'Kamrup Metro' },
  '462001': { city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', district: 'Bhopal' },
  '452001': { city: 'Indore', state: 'Madhya Pradesh', country: 'India', district: 'Indore' },
  '160017': { city: 'Chandigarh', state: 'Chandigarh', country: 'India', district: 'Sector 17' },
  '403001': { city: 'Panaji', state: 'Goa', country: 'India', district: 'North Goa' },

  // US Major Postal ZIPs
  '97477': { city: 'Springfield', state: 'OR', country: 'United States' },
  '90210': { city: 'Beverly Hills', state: 'CA', country: 'United States' },
  '10001': { city: 'New York', state: 'NY', country: 'United States' },
  '94102': { city: 'San Francisco', state: 'CA', country: 'United States' },
  '98101': { city: 'Seattle', state: 'WA', country: 'United States' },
  '60601': { city: 'Chicago', state: 'IL', country: 'United States' },
  '75001': { city: 'Dallas', state: 'TX', country: 'United States' },
  '33101': { city: 'Miami', state: 'FL', country: 'United States' },
  '02108': { city: 'Boston', state: 'MA', country: 'United States' },
  '89101': { city: 'Las Vegas', state: 'NV', country: 'United States' },
};

// Region heuristics for Indian PIN codes by first 2 digits
const INDIA_PIN_PREFIX_MAP: Record<string, { state: string; defaultCity: string }> = {
  '11': { state: 'Delhi', defaultCity: 'New Delhi' },
  '12': { state: 'Haryana', defaultCity: 'Gurugram' },
  '13': { state: 'Haryana', defaultCity: 'Ambala' },
  '14': { state: 'Punjab', defaultCity: 'Ludhiana' },
  '15': { state: 'Punjab', defaultCity: 'Bathinda' },
  '16': { state: 'Chandigarh', defaultCity: 'Chandigarh' },
  '17': { state: 'Himachal Pradesh', defaultCity: 'Shimla' },
  '18': { state: 'Jammu & Kashmir', defaultCity: 'Jammu' },
  '19': { state: 'Jammu & Kashmir', defaultCity: 'Srinagar' },
  '20': { state: 'Uttar Pradesh', defaultCity: 'Noida' },
  '21': { state: 'Uttar Pradesh', defaultCity: 'Prayagraj' },
  '22': { state: 'Uttar Pradesh', defaultCity: 'Lucknow' },
  '23': { state: 'Uttar Pradesh', defaultCity: 'Varanasi' },
  '24': { state: 'Uttarakhand', defaultCity: 'Dehradun' },
  '25': { state: 'Uttar Pradesh', defaultCity: 'Meerut' },
  '26': { state: 'Uttarakhand', defaultCity: 'Nainital' },
  '27': { state: 'Uttar Pradesh', defaultCity: 'Gorakhpur' },
  '28': { state: 'Uttar Pradesh', defaultCity: 'Agra' },
  '30': { state: 'Rajasthan', defaultCity: 'Jaipur' },
  '31': { state: 'Rajasthan', defaultCity: 'Udaipur' },
  '32': { state: 'Rajasthan', defaultCity: 'Kota' },
  '33': { state: 'Rajasthan', defaultCity: 'Bikaner' },
  '34': { state: 'Rajasthan', defaultCity: 'Jodhpur' },
  '36': { state: 'Gujarat', defaultCity: 'Rajkot' },
  '37': { state: 'Gujarat', defaultCity: 'Jamnagar' },
  '38': { state: 'Gujarat', defaultCity: 'Ahmedabad' },
  '39': { state: 'Gujarat', defaultCity: 'Surat' },
  '40': { state: 'Maharashtra', defaultCity: 'Mumbai' },
  '41': { state: 'Maharashtra', defaultCity: 'Pune' },
  '42': { state: 'Maharashtra', defaultCity: 'Nashik' },
  '43': { state: 'Maharashtra', defaultCity: 'Chhatrapati Sambhajinagar' },
  '44': { state: 'Maharashtra', defaultCity: 'Nagpur' },
  '45': { state: 'Madhya Pradesh', defaultCity: 'Indore' },
  '46': { state: 'Madhya Pradesh', defaultCity: 'Bhopal' },
  '47': { state: 'Madhya Pradesh', defaultCity: 'Gwalior' },
  '48': { state: 'Madhya Pradesh', defaultCity: 'Jabalpur' },
  '49': { state: 'Chhattisgarh', defaultCity: 'Raipur' },
  '50': { state: 'Telangana', defaultCity: 'Hyderabad' },
  '51': { state: 'Andhra Pradesh', defaultCity: 'Tirupati' },
  '52': { state: 'Andhra Pradesh', defaultCity: 'Vijayawada' },
  '53': { state: 'Andhra Pradesh', defaultCity: 'Visakhapatnam' },
  '56': { state: 'Karnataka', defaultCity: 'Bengaluru' },
  '57': { state: 'Karnataka', defaultCity: 'Mangaluru' },
  '58': { state: 'Karnataka', defaultCity: 'Hubballi' },
  '59': { state: 'Karnataka', defaultCity: 'Belagavi' },
  '60': { state: 'Tamil Nadu', defaultCity: 'Chennai' },
  '61': { state: 'Tamil Nadu', defaultCity: 'Thanjavur' },
  '62': { state: 'Tamil Nadu', defaultCity: 'Madurai' },
  '63': { state: 'Tamil Nadu', defaultCity: 'Vellore' },
  '64': { state: 'Tamil Nadu', defaultCity: 'Coimbatore' },
  '67': { state: 'Kerala', defaultCity: 'Calicut' },
  '68': { state: 'Kerala', defaultCity: 'Kochi' },
  '69': { state: 'Kerala', defaultCity: 'Thiruvananthapuram' },
  '70': { state: 'West Bengal', defaultCity: 'Kolkata' },
  '71': { state: 'West Bengal', defaultCity: 'Howrah' },
  '72': { state: 'West Bengal', defaultCity: 'Medinipur' },
  '73': { state: 'West Bengal', defaultCity: 'Siliguri' },
  '74': { state: 'West Bengal', defaultCity: 'Barasat' },
  '75': { state: 'Odisha', defaultCity: 'Bhubaneswar' },
  '76': { state: 'Odisha', defaultCity: 'Cuttack' },
  '77': { state: 'Odisha', defaultCity: 'Rourkela' },
  '78': { state: 'Assam', defaultCity: 'Guwahati' },
  '79': { state: 'Northeast', defaultCity: 'Shillong' },
  '80': { state: 'Bihar', defaultCity: 'Patna' },
  '81': { state: 'Bihar', defaultCity: 'Bhagalpur' },
  '82': { state: 'Bihar', defaultCity: 'Gaya' },
  '83': { state: 'Jharkhand', defaultCity: 'Ranchi' },
  '84': { state: 'Bihar', defaultCity: 'Muzaffarpur' },
  '85': { state: 'Bihar', defaultCity: 'Purnia' },
};

/**
 * Looks up city & state from postal / PIN code.
 * 1. Checks exact instant local dictionary.
 * 2. If 6-digit India PIN: attempts live Indian Postal API + regional prefix map.
 * 3. If 5-digit US ZIP: attempts Zippopotam API.
 */
export async function lookupPostalCode(
  rawCode: string,
  countryHint?: string
): Promise<PostalLookupResult | null> {
  const code = rawCode.trim().replace(/\s+/g, '');
  if (!code || code.length < 3) return null;

  // 1. Direct Instant match
  if (LOCAL_POSTAL_DB[code]) {
    const item = LOCAL_POSTAL_DB[code];
    return {
      city: item.city,
      state: item.state,
      country: item.country,
      district: item.district,
      source: 'local_instant',
    };
  }

  // 2. India 6-Digit PIN code processing
  if (/^\d{6}$/.test(code)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const district = po.District || '';
          const state = po.State || '';
          const name = po.Name || district;
          return {
            city: district || name,
            state: state,
            country: 'India',
            district: `${name} (${po.Block || district})`,
            source: 'api_live',
          };
        }
      }
    } catch {
      // Network timeout / offline fallback
    }

    // Heuristic prefix match for 6-digit Indian PIN
    const prefix2 = code.slice(0, 2);
    if (INDIA_PIN_PREFIX_MAP[prefix2]) {
      const info = INDIA_PIN_PREFIX_MAP[prefix2];
      return {
        city: info.defaultCity,
        state: info.state,
        country: 'India',
        district: `PIN Sector ${prefix2}xxx`,
        source: 'local_instant',
      };
    }
  }

  // 3. US 5-Digit ZIP code processing
  if (/^\d{5}$/.test(code)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`https://api.zippopotam.us/us/${code}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.places && data.places.length > 0) {
          const place = data.places[0];
          return {
            city: place['place name'],
            state: place['state abbreviation'] || place['state'],
            country: 'United States',
            source: 'api_live',
          };
        }
      }
    } catch {
      // Ignore
    }
  }

  return null;
}

export const POPULAR_PIN_SUGGESTIONS = [
  { pin: '400050', label: '400050 Mumbai (Bandra)' },
  { pin: '110001', label: '110001 New Delhi (CP)' },
  { pin: '560001', label: '560001 Bengaluru' },
  { pin: '411001', label: '411001 Pune' },
  { pin: '600001', label: '600001 Chennai' },
  { pin: '500081', label: '500081 Hyderabad (HITEC)' },
];
