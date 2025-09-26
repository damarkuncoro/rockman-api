import db from '../rockman-tests/src/db'
import { users } from '../rockman-tests/src/db/schema/users'

async function testQuery() {
  console.log('🔍 Testing direct database query...')
  
  try {
    // Test 1: Direct query
    const result1 = db.select().from(users)
    console.log('📊 Query builder type:', typeof result1)
    console.log('📊 Query builder:', result1)
    
    // Test 2: Execute query
    const result2 = await db.select().from(users)
    console.log('📊 Executed query type:', typeof result2)
    console.log('📊 Is array:', Array.isArray(result2))
    console.log('📊 Length:', result2?.length || 0)
    console.log('📊 First item:', result2?.[0] || 'No items')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testQuery()
