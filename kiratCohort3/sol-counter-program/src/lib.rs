use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    entrypoint
};

#[derive(BorshSerialize, BorshDeserialize)]
enum Instruction{
    Increment(u32),
    Decrement(u32)
}

#[derive(BorshSerialize, BorshDeserialize)]
struct Counter{
    count: u32,
}
entrypoint!(process_instruction);
 pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let acc = next_account_info(&mut accounts.iter())?;
    let mut counter = Counter::try_from_slice(&acc.data.borrow())?;
    let instruction = Instruction::try_from_slice(instruction_data)?;
    match instruction {
        Instruction::Increment(value) => counter.count += value,
        Instruction::Decrement(value) => counter.count -= value,
    }
    counter.serialize(&mut *acc.data.borrow_mut())?;
    Ok(())
}