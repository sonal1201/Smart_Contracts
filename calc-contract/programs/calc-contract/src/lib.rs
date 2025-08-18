use anchor_lang::prelude::*;

declare_id!("ETMhQdDw3dWKiGuzzywxaYVFTxaCb5YBBubNRqr375mh");


#[program]
pub mod calc_contract {
    use super::*;

    pub fn init(ctx: Context<Initilization>, init_value: u32) -> Result<()> {
        ctx.accounts.account.num = init_value;
        Ok(())
    }

    pub fn halve(ctx: Context<Halve>) -> Result<()> {
        ctx.accounts.account.num /= 2;
        Ok(())
    }

    pub fn double(ctx: Context<Double>) -> Result<()> {
        ctx.accounts.account.num *= 2;
        Ok(())
    }

    pub fn add(ctx: Context<Add>, num: u32) -> Result<()> {
        ctx.accounts.account.num += num;
        Ok(())
    }
}

#[account]
struct DataShape {
    pub num: u32,
}

#[derive(Accounts)]
pub struct Initilization<'info> {
    #[account(init,payer=signer,space = 8 + 4)]
    pub account: Account<'info, DataShape>,
    pub system_program: Program<'info, System>,
    #[account(mut)]
    signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Double<'info> {
    #[account(mut)]
    pub account: Account<'info, DataShape>,
    signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Halve<'info> {
    #[account(mut)]
    pub account: Account<'info, DataShape>,
    signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Add<'info> {
    #[account(mut)]
    pub account: Account<'info, DataShape>,
    signer: Signer<'info>,
}
