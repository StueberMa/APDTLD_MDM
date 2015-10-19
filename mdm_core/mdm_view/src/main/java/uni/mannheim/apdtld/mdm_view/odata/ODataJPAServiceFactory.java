package uni.mannheim.apdtld.mdm_view.odata;

import javax.persistence.EntityManagerFactory;

import org.apache.olingo.odata2.api.ODataCallback;
import org.apache.olingo.odata2.api.ODataService;
import org.apache.olingo.odata2.api.ODataServiceFactory;
import org.apache.olingo.odata2.api.edm.provider.EdmProvider;
import org.apache.olingo.odata2.api.exception.ODataException;
import org.apache.olingo.odata2.api.processor.ODataContext;
import org.apache.olingo.odata2.api.processor.ODataErrorCallback;
import org.apache.olingo.odata2.api.processor.ODataSingleProcessor;
import org.apache.olingo.odata2.jpa.processor.api.ODataJPAContext;
import org.apache.olingo.odata2.jpa.processor.api.exception.ODataJPAErrorCallback;
import org.apache.olingo.odata2.jpa.processor.api.exception.ODataJPARuntimeException;
import org.apache.olingo.odata2.jpa.processor.api.factory.ODataJPAAccessFactory;
import org.apache.olingo.odata2.jpa.processor.api.factory.ODataJPAFactory;

/**
 * OData JPA Processor implementation.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 25.09.2015
 */
public class ODataJPAServiceFactory extends ODataServiceFactory {

	// constants
	private static final String DATA_MODEL_NAME = "data_model";

	// attributes
	private ODataJPAContext oDataJPAContext;
	private ODataContext oDataContext;
	private boolean setDetailErrors = false;

	/**
	 * Creates an OData Service based on ctx.
	 * 
	 * @param ODataContext
	 * @return ODataService
	 * @throws ODataException
	 */
	@Override
	public ODataService createService(final ODataContext ctx) throws ODataException {

		// attributes
		ODataJPAFactory factory = null;
		ODataJPAAccessFactory accessFactory = null;
		ODataSingleProcessor odataJPAProcessor = null;
		EdmProvider edmProvider = null;

		this.oDataContext = ctx;

		// Initialize OData JPA Context
		this.oDataJPAContext = initializeODataJPAContext();

		// validate pre-conditions
		if (this.oDataJPAContext.getEntityManagerFactory() == null) {
			throw ODataJPARuntimeException
					.throwException(ODataJPARuntimeException.ENTITY_MANAGER_NOT_INITIALIZED, null);
		}

		factory = ODataJPAFactory.createFactory();
		accessFactory = factory.getODataJPAAccessFactory();

		// OData JPA Processor
		if (this.oDataJPAContext.getODataContext() == null) {
			this.oDataJPAContext.setODataContext(ctx);
		}

		odataJPAProcessor = new ODataBatchProcessor(this.oDataJPAContext);

		// OData Entity Data Model Provider based on JPA
		edmProvider = accessFactory.createJPAEdmProvider(this.oDataJPAContext);

		return createODataSingleProcessorService(edmProvider, odataJPAProcessor);
	}

	/**
	 * Method to get context.
	 * 
	 * @return aODataJPAContext
	 * @throws ODataJPARuntimeException
	 */
	public ODataJPAContext getODataJPAContext() throws ODataJPARuntimeException {
		
		// init. JPA ctx
		if (this.oDataJPAContext == null) {
			this.oDataJPAContext = ODataJPAFactory.createFactory().getODataJPAAccessFactory().createODataJPAContext();
		}
		
		// init. data ctx
		if (oDataContext != null) {
			this.oDataJPAContext.setODataContext(oDataContext);
		}
		
		return this.oDataJPAContext;

	}

	/**
	 * Method to initialize OData service.
	 * 
	 * @return ODataJPAContext
	 * @throws ODataJPARuntimeException
	 */
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

	/**
	 * Method to enable detail error message.
	 * 
	 * @param setDetailErrors
	 */
	protected void setDetailErrors(final boolean setDetailErrors) {
		this.setDetailErrors = setDetailErrors;
	}

	/**
	 * Method to get callback.
	 * 
	 * @param callbackInterface
	 * @return ODataCallback
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T extends ODataCallback> T getCallback(final Class<? extends ODataCallback> callbackInterface) {
		
		if (setDetailErrors == true) {
			if (callbackInterface.isAssignableFrom(ODataErrorCallback.class)) {
				return (T) new ODataJPAErrorCallback();
			}
		}
		
		return null;
	}
}
