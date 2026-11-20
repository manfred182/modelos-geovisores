#!/usr/bin/env python3
"""
Simple Django GIS Verification Script
Can be run directly in Docker container
"""

print("🔧 Django GIS Verification")
print("=" * 30)

# Test 1: Check environment
print("1. Environment check...")
import os
db_engine = os.getenv('DB_ENGINE', 'Not set')
print(f"   DB_ENGINE: {db_engine}")

# Test 2: Basic Django test
print("\n2. Django import test...")
try:
    import sys
    sys.path.append('/project')
    
    import django
    from django.conf import settings
    
    # Configure Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'i2dbackend.settings.local')
    django.setup()
    
    # Check database engine
    actual_engine = settings.DATABASES['default']['ENGINE']
    print(f"   Configured engine: {actual_engine}")
    
    if 'postgis' in actual_engine:
        print("   ✅ PostGIS backend configured")
    else:
        print("   ❌ PostGIS backend not configured")
        
except Exception as e:
    print(f"   ❌ Django setup failed: {e}")

# Test 3: Model import test
print("\n3. Model import test...")
try:
    from applications.dpto.models import DptoQueries
    from applications.mupio.models import MpioQueries
    print("   ✅ GIS models imported successfully")
    
    # Test basic queries
    dpto_count = DptoQueries.objects.count()
    mpio_count = MpioQueries.objects.count()
    print(f"   ✅ Departments: {dpto_count}")
    print(f"   ✅ Municipalities: {mpio_count}")
    
except Exception as e:
    print(f"   ❌ Model import failed: {e}")

# Test 4: Geometry field test
print("\n4. Geometry field test...")
try:
    sample_dept = DptoQueries.objects.first()
    if sample_dept:
        print(f"   ✅ Sample department: {sample_dept.nombre}")
        print(f"   ✅ Geometry type: {type(sample_dept.geom)}")
        
        if sample_dept.geom:
            print(f"   ✅ Has geometry data: Yes")
            print(f"   ✅ Geometry class: {sample_dept.geom.__class__.__name__}")
            print(f"   ✅ Area: {sample_dept.geom.area:.4f}")
        else:
            print("   ⚠️  No geometry data")
    else:
        print("   ❌ No departments found")
        
except Exception as e:
    print(f"   ❌ Geometry test failed: {e}")

print("\n🎯 Verification completed!")
