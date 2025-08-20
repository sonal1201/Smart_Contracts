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

  let context;
  let provider;
  let votingProgram;

  beforeAll(async () => {
    context = await startAnchor("", [{ name: "voting", programId: votingAddress }], []);

    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider,
    );
  })

  it('Initialize Poll', async () => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is you fav color?",
      new anchor.BN(0),
      new anchor.BN(1855624279)
    ).rpc()

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    expect(poll.pollId.toNumber()).toBe(1);
    expect(poll.description).toEqual("What is you fav color?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())
  })

  it("Initilize_candidate", async () => {
    await votingProgram.methods.initializeCandidate(
      "Yellow",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "Green",
      new anchor.BN(1),
    ).rpc();

    const [yellowAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Yellow")],
      votingAddress
    )
    const yellowCnadidate = await votingProgram.account.candidate.fetch(yellowAddress)
    console.log(yellowCnadidate)

    expect(yellowCnadidate.candidateVotes.toNumber()).toEqual(0);

    const [greenAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Green")],
      votingAddress
    )
    const greenCnadidate = await votingProgram.account.candidate.fetch(greenAddress)
    console.log(greenCnadidate)
    expect(greenCnadidate.candidateVotes.toNumber()).toEqual(0);



  })
 it("vote", async () => {
  const pollId = new anchor.BN(1);

  const [pollAddress] = PublicKey.findProgramAddressSync(
    [pollId.toArrayLike(Buffer, "le", 8)],
    votingAddress
  );

  const [yellowAddress] = PublicKey.findProgramAddressSync(
    [pollId.toArrayLike(Buffer, "le", 8), Buffer.from("Yellow")],
    votingAddress
  );

  await votingProgram.methods
    .vote( "Yellow",
      new anchor.BN(1),)

    .rpc();

  // ✅ check updated votes
  const yellowCandidate = await votingProgram.account.candidate.fetch(yellowAddress);
  expect(yellowCandidate.candidateVotes.toNumber()).toBe(1);
});
})
