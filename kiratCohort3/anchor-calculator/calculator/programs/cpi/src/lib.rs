use anchor_lang::prelude::*;
use solana_program::instruction::Instruction;
use solana_program::program::invoke;

declare_id!("8KhdzCsYQeUF1AK1yPf1ruw15qL5zLVT3L5kRTknhy6P");

#[program]
pub mod cpi_contract {
    use super::*;

    pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.sender.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let account_metas = vec![
            AccountMeta::new(*from_pubkey.key, true),
            AccountMeta::new(*to_pubkey.key, false),
        ];

        let instruction_descriminator: u32 = 2;

        let mut instruction_data = Vec::with_capacity(4 + 8);
        instruction_data.extend_from_slice(&instruction_descriminator.to_le_bytes());
        instruction_data.extend_from_slice(&amount.to_le_bytes());

        let instruction = Instruction {
            program_id: *program_id.key,
            accounts: account_metas,
            data: instruction_data,
        };

        invoke(&instruction, &[from_pubkey, to_pubkey, program_id])?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(mut)]
    sender: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
