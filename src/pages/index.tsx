import Head from 'next/head'
import Image from 'next/image'
import { trpc } from '@/utils/trpc';
import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { useMemo, useState } from 'react';
import { inferQueryResponse } from './api/trpc/[trpc]';
import type React from 'react';
import { PokemonSprites } from 'pokenode-ts';

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
  // const {data, isLoading} = trpc.hello.useQuery({ text: 'Thomas' });

  // if (isLoading) return <div>Loading...</div>
  // if (data) return <div>{data.greeting}</div>
  const [ids, updateIds] = useState(getOptionsForVote()); 
  const [first, second] = ids;
  const firstPokemon = trpc.getpokemonbyid.useQuery( {id: first} );
  const secondPokemon = trpc.getpokemonbyid.useQuery( {id: second} );
  const voteMutation = trpc.castvote.useMutation();

  // console.log(secondPokemon.data)

  console.log(firstPokemon.isLoading)
  console.log(secondPokemon.isLoading)

  // if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    // todo: fire mutation to persist changes
      if (selected === first) {
    voteMutation.mutate({votedFor: first, votedAgainst: second})
  } else {
    voteMutation.mutate({votedFor: second, votedAgainst: first})
  }
    updateIds(getOptionsForVote());
    
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center"> Which Pokemon is Rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">

        {!firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data && (
          <>
            <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
            <div className="p-8">Vs</div>
            <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
          </>
        )}

        <div className="p-2" />
      </div>  
    </div>
  )
}


// type PokemonFromServer = inferQueryResponse<"getpokemonbyid">;

type PokemonFromServer = {
  id: number,
  name: string
  spriteUrl: string
}

const PokemonListing: React.FC<{pokemon: PokemonFromServer, vote: () => void}> = (props) => {
  console.log("in Pokemon Listing")
  return (
    <div className="flex flex-col items-center"> 
      <Image width={256} height={256} layout="fixed" alt="alt text" src={props.pokemon.spriteUrl} />
      <div className="text-xl text-center capitalize mt-[-2rem]">{props.pokemon.name}</div>
      <button className={btn} onClick={() => props.vote()}>Rounder</button>
    </div>
  );
}
