import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cedulaHash = request.nextUrl.searchParams.get('cedula_hash')

    if (!cedulaHash) {
      return NextResponse.json(
        { error: 'cedula_hash is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('cedula_hash', cedulaHash)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      matches: data,
      count: data.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching matches' },
      { status: 500 }
    )
  }
}
