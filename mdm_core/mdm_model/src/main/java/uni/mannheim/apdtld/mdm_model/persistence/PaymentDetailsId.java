package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;


public class PaymentDetailsId implements Serializable {
	// constants
	private static final long serialVersionUID = 1L;
	
	private String bic;
	private String iban;
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((bic == null) ? 0 : bic.hashCode());
		result = prime * result + ((iban == null) ? 0 : iban.hashCode());
		return result;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PaymentDetailsId other = (PaymentDetailsId) obj;
		if (bic == null) {
			if (other.bic != null)
				return false;
		} else if (!bic.equals(other.bic))
			return false;
		if (iban == null) {
			if (other.iban != null)
				return false;
		} else if (!iban.equals(other.iban))
			return false;
		return true;
	}
}
