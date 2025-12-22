use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    instruction::{AccountMeta, Instruction},
    program::invoke,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let mut siter = accounts.iter();
    let data_account = next_account_info(&mut iter)?;
    let double_program_address = next_account_info(&mut iter)?;

    let instruction = Instruction {
        program_id: *double_program_address.key,
        accounts: vec![{pubkey: *data_account.key, isSigner: true, isWritable: true}],
        data: vec![],
    };

    invoke(&instruction, &[data_account.clone()])?;
    Ok(())
}
