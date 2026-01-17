import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { recordSolve } from '@/services/solves.service';
import { CreateSolveDTO } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const dto: CreateSolveDTO = {
      problemId: body.problemId,
      personalDifficulty: body.personalDifficulty,
      timeComplexity: body.timeComplexity,
      spaceComplexity: body.spaceComplexity,
      pseudocode: body.pseudocode,
      notes: body.notes,
      solvedAt: body.solvedAt ? new Date(body.solvedAt) : undefined,
    };

    const solve = await recordSolve(supabase, dto);

    return NextResponse.json({ solve });
  } catch (error) {
    console.error('Error recording solve:', error);
    return NextResponse.json(
      { error: 'Failed to record solve' },
      { status: 500 }
    );
  }
}
