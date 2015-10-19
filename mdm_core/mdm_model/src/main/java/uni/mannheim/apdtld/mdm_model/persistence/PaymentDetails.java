package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Embeddable;

@Embeddable //@IdClass(PaymentDetailsId.class)
public class PaymentDetails implements Serializable {

	// constants
	private static final long serialVersionUID = 1L;
	
	private String bankAccount;
//	@Id private String bic;
//	@Id private String iban;
	
	private String bic;
	private String iban;
	
	
	public String getBankAccount() {
		return bankAccount;
	}
	public void setBankAccount(String bankAccount) {
		this.bankAccount = bankAccount;
	}
	public String getBic() {
		return bic;
	}
	public void setBic(String bic) {
		this.bic = bic;
	}
	public String getIban() {
		return iban;
	}
	public void setIban(String iban) {
		this.iban = iban;
	}
}
