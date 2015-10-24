package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Embeddable;

/**
 * Embedded PaymentDetails.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 23.10.2015
 */
@Embeddable
public class PaymentDetails implements Serializable {

	// constants
	private static final long serialVersionUID = 1L;
	
	// attributes
	private String bankAccount;
	private String bic;
	private String iban;
	
	/**
	 * GET bankAccount
	 * 
	 * @return
	 */
	public String getBankAccount() {
		return bankAccount;
	}
	
	/**
	 * SET bankAccount
	 * 
	 * @param bankAccount
	 */
	public void setBankAccount(String bankAccount) {
		this.bankAccount = bankAccount;
	}
	
	/**
	 * GET bic
	 * 
	 * @return
	 */
	public String getBic() {
		return bic;
	}
	
	/**
	 * SET bic
	 * 
	 * @param bic
	 */
	public void setBic(String bic) {
		this.bic = bic;
	}
	
	/**
	 * GET iban
	 * 
	 * @return
	 */
	public String getIban() {
		return iban;
	}
	
	/**
	 * SET iban
	 * 
	 * @param iban
	 */
	public void setIban(String iban) {
		this.iban = iban;
	}
}
