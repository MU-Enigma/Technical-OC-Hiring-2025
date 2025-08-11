using UnityEngine;

public class lethalShoot : MonoBehaviour
{
    public Transform firePoint;
    public Rigidbody2D bulletPrefab;
    public float bulletForce = 20f;
    [SerializeField] private AudioClip lethalShootClip;

    void Update()
    {
        if (Input.GetMouseButtonDown(1) && bulletPickup.bulletCount > 0)
        {
            soundManager.instance.PlaySoundClip(lethalShootClip, transform, 1f);
            Shoot();
        }
    }

    void Shoot()
    {
        Rigidbody2D bullet = Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
        bullet.AddForce(firePoint.up * bulletForce, ForceMode2D.Impulse);

        bulletPickup.instance.RemoveBullet(1); // this updates the UI too
    }
}
