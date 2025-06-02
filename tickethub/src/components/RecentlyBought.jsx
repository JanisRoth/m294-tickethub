import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function RecentlyBought() {
  const [purchases, setPurchases] = useState([])

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('User not authenticated')
      return
    }

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        id,
        price,
        purchase_date,
        tickets(event_name),
        users(username)
      `)
      .eq('buyer_id', user.id)
      .order('purchase_date', { ascending: false })
      .limit(3)

    if (error) console.error(error)
    else setPurchases(data)
  }

  return (
    <div style={{ marginTop: '3rem' }}>
      <h3 style={{ color: 'white' }}>Recently Bought Tickets</h3>
      {purchases.map(p => (
        <div key={p.id} style={{
          backgroundColor: '#2c2c2c',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#f15a29',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            marginRight: '1rem'
          }}>
            {p.users?.username?.charAt(0).toUpperCase() ?? 'U'}
          </div>

          <div style={{ flexGrow: 1 }}>
            {p.tickets?.event_name}
          </div>

          <div style={{ fontWeight: 'bold' }}>
            CHF {p.price}
          </div>
        </div>
      ))}
    </div>
  )
}
