package uni.mannheim.apdtld.mdm_view.odata;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.sql.DataSource;

import org.eclipse.persistence.config.PersistenceUnitProperties;

/**
 * Handles the singleton EntityManagerFactory instance.
 */
/**
 * Singleton EntityManagerFactory
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 25.09.2015
 */
public class JpaEntityManagerFactory {

	// constants
	public static final String DATA_SOURCE_NAME = "java:comp/env/jdbc/DefaultDB";

	// attributes
	private static HashMap<String, EntityManagerFactory> entityManager = new HashMap<String, EntityManagerFactory>();

	/**
	 * Constructor
	 */
	private JpaEntityManagerFactory() {

	}

	/**
	 * Method to get singleton EntityManagerFactory instance.
	 *
	 * @param modelName
	 * @return EntityManagerFactory
	 * @throws NamingException
	 * @throws SQLException
	 */
	public static synchronized EntityManagerFactory getEntityManagerFactory(String modelName) throws NamingException,
			SQLException {

		// declaration
		EntityManagerFactory entity = null;
		InitialContext ctx = null;
		DataSource ds = null;
		Map<String, Object> properties = null;

		// create instance
		if ((entity = entityManager.get(modelName)) == null) {
			// initialize
			ctx = new InitialContext();
			ds = (DataSource) ctx.lookup(DATA_SOURCE_NAME);
			properties = new HashMap<String, Object>();

			// create entity & add
			properties.put(PersistenceUnitProperties.NON_JTA_DATASOURCE, ds);
			entity = Persistence.createEntityManagerFactory(modelName, properties);
			entityManager.put(modelName, entity);
		}

		return entity;
	}
}