using UnityEngine;

public class enemyBullet : MonoBehaviour
{
    public GameObject playerDeath;
    [SerializeField] private AudioClip playerDeathClip;

    void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            if (playerDeath != null)
                soundManager.instance.PlaySoundClip(playerDeathClip, transform, 1f);
                Instantiate(playerDeath, collision.transform.position, Quaternion.identity);

            Destroy(collision.gameObject);
        }

        Destroy(gameObject);
    }
}