using UnityEngine;

public class lethalBullet : MonoBehaviour
{
    public GameObject explosionPrefab;
    public LayerMask enemyLayer;
    public enemyCount enemyCount;
    [SerializeField] private AudioClip explosion;
    void Start()
    {
        enemyCount = GameObject.FindGameObjectWithTag("Enemy Count").GetComponent<enemyCount>();
    }

    void OnCollisionEnter2D(Collision2D collision)
    {
        if (((1 << collision.gameObject.layer) & enemyLayer) != 0)
        {
            if (explosionPrefab != null)
                soundManager.instance.PlaySoundClip(explosion, transform, 1f);
            Instantiate(explosionPrefab, collision.transform.position, Quaternion.identity);
            enemyCount.subtract();

            Destroy(collision.gameObject);
        }
        Destroy(gameObject);
    }
}
