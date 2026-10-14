from sqlalchemy.orm import Session
from app.models import DirectoryResource, User
from app.auth import get_password_hash

SEED_RESOURCES = [
    {
        "name": "Tele-MANAS (National Tele-Mental Health Helpline)",
        "category": "National Helpline",
        "phone": "14416",
        "alternate_phone": "1800-891-4416",
        "address": "National Tele-Mental Health Programme, MOHFW, Nirman Bhawan",
        "state": "All India (National)",
        "city": "Pan-India",
        "operational_hours": "24/7 (365 Days)",
        "languages_json": '["Hindi", "English", "Punjabi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada", "Malayalam"]',
        "website": "https://telemanas.mohfw.gov.in",
        "source_url": "https://telemanas.mohfw.gov.in/#/home",
        "verified_status": "Verified",
        "verification_date": "2026-03-01",
        "notes": "Flagship initiative by Ministry of Health & Family Welfare. Toll-free psychological crisis, distress, and addiction counseling in 20+ regional languages."
    },
    {
        "name": "National Drug De-Addiction Helpline (Nasha Mukti)",
        "category": "National Helpline",
        "phone": "14446",
        "alternate_phone": "011-23381643",
        "address": "Ministry of Social Justice and Empowerment, Shastri Bhawan",
        "state": "All India (National)",
        "city": "Pan-India",
        "operational_hours": "24/7",
        "languages_json": '["Hindi", "English", "Regional Languages"]',
        "website": "https://nmba.dosje.gov.in",
        "source_url": "https://socialjustice.gov.in/schemes/31",
        "verified_status": "Verified",
        "verification_date": "2026-02-15",
        "notes": "Toll-free national helpline under the Nasha Mukt Bharat Abhiyaan (NMBA) for counseling, de-addiction guidance, and referral to nearest IRCA centers."
    },
    {
        "name": "KIRAN Mental Health Rehabilitation Helpline",
        "category": "National Helpline",
        "phone": "1800-599-0019",
        "alternate_phone": None,
        "address": "Department of Empowerment of Persons with Disabilities, MSJE",
        "state": "All India (National)",
        "city": "Pan-India",
        "operational_hours": "24/7",
        "languages_json": '["Hindi", "English", "Assamese", "Bengali", "Gujarati", "Kannada", "Malayalam", "Marathi", "Odia", "Punjabi", "Tamil", "Telugu", "Urdu"]',
        "website": "https://disabilityaffairs.gov.in",
        "source_url": "https://pib.gov.in/PressReleasePage.aspx?PRID=1652157",
        "verified_status": "Verified",
        "verification_date": "2026-01-20",
        "notes": "Provides early screening, first aid, psychological support, distress management, and mental health rehabilitation in 13 languages."
    },
    {
        "name": "NIMHANS Centre for Addiction Medicine (CAM)",
        "category": "Hospital",
        "phone": "080-26995000",
        "alternate_phone": "080-46110007",
        "address": "Hosur Road, Lakkasandra, Bengaluru, Karnataka 560029",
        "state": "Karnataka",
        "city": "Bengaluru",
        "operational_hours": "OPD: 9:00 AM - 4:00 PM (Emergency 24/7)",
        "languages_json": '["Kannada", "Hindi", "English", "Tamil", "Telugu"]',
        "website": "https://nimhans.ac.in/cam",
        "source_url": "https://nimhans.ac.in/cam/",
        "verified_status": "Verified",
        "verification_date": "2026-03-05",
        "notes": "Apex national institute offering specialized outpatient, inpatient detoxification, and evidence-based psychological therapy for substance use disorders."
    },
    {
        "name": "AIIMS National Drug Dependence Treatment Centre (NDDTC)",
        "category": "Hospital",
        "phone": "0120-2755555",
        "alternate_phone": "011-26588500",
        "address": "Sector 19, Kamla Nehru Nagar, Ghaziabad, Uttar Pradesh & AIIMS Ansari Nagar",
        "state": "Delhi / NCR",
        "city": "New Delhi / Ghaziabad",
        "operational_hours": "OPD: 8:30 AM - 1:00 PM (Mon-Sat)",
        "languages_json": '["Hindi", "English"]',
        "website": "https://www.aiims.edu/en/departments-and-centers/central-facilities/nddtc.html",
        "source_url": "https://www.aiims.edu",
        "verified_status": "Verified",
        "verification_date": "2026-02-10",
        "notes": "Premier national treatment and research centre under AIIMS New Delhi for opioid substitution therapy (OST), alcohol detox, and family counseling."
    },
    {
        "name": "Vandrevala Foundation Helpline",
        "category": "Support Group",
        "phone": "+91 9999 666 555",
        "alternate_phone": None,
        "address": "Bandra West, Mumbai, Maharashtra",
        "state": "Maharashtra",
        "city": "Mumbai",
        "operational_hours": "24/7",
        "languages_json": '["English", "Hindi", "Marathi", "Gujarati"]',
        "website": "https://www.vandrevalafoundation.com",
        "source_url": "https://www.vandrevalafoundation.com",
        "verified_status": "Verified",
        "verification_date": "2026-01-15",
        "notes": "Accredited non-profit providing free, immediate crisis counseling, mental health intervention, and addiction coping strategies."
    },
    {
        "name": "Kripa Foundation Rehabilitation Center",
        "category": "Rehab Center",
        "phone": "022-26405411",
        "alternate_phone": "+91 98200 48485",
        "address": "Mount Carmel Church Compound, 81/A Chapel Road, Bandra West",
        "state": "Maharashtra",
        "city": "Mumbai",
        "operational_hours": "9:30 AM - 6:00 PM",
        "languages_json": '["Hindi", "English", "Marathi"]',
        "website": "https://kripafoundation.org",
        "source_url": "https://kripafoundation.org",
        "verified_status": "Verified",
        "verification_date": "2026-02-01",
        "notes": "Largest recognized NGO in India devoted to the care of people affected by chemical dependency and HIV/AIDS, operating in 12 Indian states."
    },
    {
        "name": "TTK Hospital (T.T. Ranganathan Clinical Research Foundation)",
        "category": "Rehab Center",
        "phone": "044-24912948",
        "alternate_phone": "044-24918461",
        "address": "4th Main Road, Indira Nagar, Adyar, Chennai, Tamil Nadu 600020",
        "state": "Tamil Nadu",
        "city": "Chennai",
        "operational_hours": "9:00 AM - 5:30 PM",
        "languages_json": '["Tamil", "English", "Hindi"]',
        "website": "https://ttkhospital.com",
        "source_url": "https://ttkhospital.com",
        "verified_status": "Verified",
        "verification_date": "2026-01-25",
        "notes": "Pioneering de-addiction hospital offering integrated medical detoxification, psychological rehabilitation, and family therapy programs."
    },
    {
        "name": "Hermitage Care & De-addiction Hospital",
        "category": "Rehab Center",
        "phone": "+91 98726 00021",
        "alternate_phone": "0183-2500000",
        "address": "Majitha-Verka Bypass, Amritsar, Punjab 143001",
        "state": "Punjab",
        "city": "Amritsar",
        "operational_hours": "24/7",
        "languages_json": '["Punjabi", "Hindi", "English"]',
        "website": "https://hermitagerehab.org",
        "source_url": "https://hermitagerehab.org",
        "verified_status": "Verified",
        "verification_date": "2026-02-28",
        "notes": "Comprehensive psychiatric and de-addiction center specializing in youth rehabilitation and relapse prevention in Punjab."
    },
    {
        "name": "Navchetna Integrated Rehabilitation Centre (IRCA)",
        "category": "Counseling",
        "phone": "0542-2585222",
        "alternate_phone": "+91 94152 02145",
        "address": "Pandeypur, Varanasi, Uttar Pradesh 221002",
        "state": "Uttar Pradesh",
        "city": "Varanasi",
        "operational_hours": "10:00 AM - 6:00 PM",
        "languages_json": '["Hindi", "Bhojpuri", "English"]',
        "website": "https://socialjustice.gov.in",
        "source_url": "https://socialjustice.gov.in/schemes/31",
        "verified_status": "Verified",
        "verification_date": "2026-03-02",
        "notes": "Government-aided IRCA center supported by Ministry of Social Justice & Empowerment offering free counseling, food, shelter, and medical care."
    }
]

def seed_database(db: Session):
    """Ensure essential demo data and genuine directory listings exist in database."""
    # Check directory
    count = db.query(DirectoryResource).count()
    if count == 0:
        for res_data in SEED_RESOURCES:
            resource = DirectoryResource(**res_data)
            db.add(resource)
        db.commit()

    # Check demo user
    demo_user = db.query(User).filter(User.email == "demo@sankalp.in").first()
    if not demo_user:
        new_demo = User(
            email="demo@sankalp.in",
            hashed_password=get_password_hash("sankalp2026"),
            full_name="Aarav Sharma",
            role="user",
            preferred_language="en",
            consent_given=True,
            emergency_contact_name="Pooja Sharma",
            emergency_contact_phone="+91 98765 43210"
        )
        db.add(new_demo)
        db.commit()
