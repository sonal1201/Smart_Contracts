import { BankrunProvider, startAnchor } from "anchor-bankrun";
import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Counter } from '../target/types/counter'
import { Voting } from "../target/types/voting"
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";

const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");


describe('Voting', () => {

  it('Initialize Poll', async () => {
    const context = await startAnchor("", [{ name: "voting", programId: votingAddress }], []);

    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Voting>(
      IDL,
      provider,
    );

    await votingProgram.methods.initilalizePoll(
      new anchor.BN(1),
      "What is you fav color?",
      new anchor.BN(0),
      new anchor.BN(1855624279)
    ).rpc()

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8)],
      votingAddress
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    expect(poll.pollId.toNumber()).toBe(1);
    expect(poll.description).toEqual("What is you fav color?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())
  })

})
