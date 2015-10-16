package uni.mannheim.apdtld.mdm_view.odata;

import javax.persistence.EntityManagerFactory;

import org.apache.olingo.odata2.jpa.processor.api.ODataJPAContext;
import org.apache.olingo.odata2.jpa.processor.api.ODataJPAServiceFactory;
import org.apache.olingo.odata2.jpa.processor.api.exception.ODataJPARuntimeException;

/**
 * OData JPA Processor implementation.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 25.09.2015
 */
public class ODataServiceFactory extends ODataJPAServiceFactory {
	
	// constants
	private static final String DATA_MODEL_NAME = "data_model";
	
	/**
	 * Method to init. OData service.
	 * 
	 * @return ODataJPAContext
	 * @throws ODataJPARuntimeException
	 */
	@Override
	public ODataJPAContext initializeODataJPAContext() throws ODataJPARuntimeException {
		
		// declaration
		ODataJPAContext oDataJPAContext = null;
		EntityManagerFactory emf = null;
		
		// initialization
		oDataJPAContext = this.getODataJPAContext();
		
		// get entity manager
		try {
			emf = JpaEntityManagerFactory.getEntityManagerFactory(DATA_MODEL_NAME);
			oDataJPAContext.setEntityManagerFactory(emf);
			oDataJPAContext.setPersistenceUnitName(DATA_MODEL_NAME);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		
		return oDataJPAContext;
	}
}