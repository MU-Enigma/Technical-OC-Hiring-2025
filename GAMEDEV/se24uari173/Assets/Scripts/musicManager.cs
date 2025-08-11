using UnityEngine;
using System.Collections;

public class musicManager : MonoBehaviour
{
    [Header("Audio Sources")]
    public AudioSource defaultMusic;
    public AudioSource chaseMusic;
   
    [Header("Volume Settings")]
    [Range(0f, 1f)]
    public float maxDefaultVolume = 1f;
    [Range(0f, 1f)]
    public float maxChaseVolume = 1f;
   
    [Header("Crossfade Settings")]
    public float fadeDuration = 0.5f;
   
    private bool isChasing = false;
    private Coroutine musicFadeRoutine;
    private int chasingEnemiesCount = 0; // Track how many enemies are chasing
    
    void Start()
    {
        // Initialize both audio sources
        if (defaultMusic != null)
        {
            defaultMusic.volume = maxDefaultVolume;
            defaultMusic.loop = true;
            defaultMusic.Play();
        }
       
        if (chaseMusic != null)
        {
            chaseMusic.volume = 0f;
            chaseMusic.loop = true;
            chaseMusic.Play();
        }
    }
    
    public void StartChase()
    {
        chasingEnemiesCount++;
        
        if (!isChasing)
        {
            isChasing = true;
            CrossfadeMusic(defaultMusic, chaseMusic, maxChaseVolume);
        }
    }
    
    public void StopChase()
    {
        chasingEnemiesCount--;
        chasingEnemiesCount = Mathf.Max(0, chasingEnemiesCount); // Prevent negative values
        
        // Only stop chase music when NO enemies are chasing
        if (chasingEnemiesCount <= 0 && isChasing)
        {
            isChasing = false;
            CrossfadeMusic(chaseMusic, defaultMusic, maxDefaultVolume);
        }
    }
    
    // Crossfade from one music track to another smoothly
    void CrossfadeMusic(AudioSource from, AudioSource to, float targetVolume)
    {
        if (musicFadeRoutine != null)
            StopCoroutine(musicFadeRoutine);
        musicFadeRoutine = StartCoroutine(CrossfadeRoutine(from, to, targetVolume));
    }
    
    IEnumerator CrossfadeRoutine(AudioSource from, AudioSource to, float targetVolume)
    {
        float fromStartVolume = from != null ? from.volume : 0f;
        float toStartVolume = to != null ? to.volume : 0f;
       
        float t = 0f;
        while (t < fadeDuration)
        {
            t += Time.deltaTime;
            float normalized = t / fadeDuration;
            if (from != null)
                from.volume = Mathf.Lerp(fromStartVolume, 0f, normalized);
            if (to != null)
                to.volume = Mathf.Lerp(toStartVolume, targetVolume, normalized);
            yield return null;
        }
        
        // Ensure final volumes are exact
        if (from != null) from.volume = 0f;
        if (to != null) to.volume = targetVolume;
    }
    
    // Public method to stop all music (useful for game pause, etc.)
    public void StopAllMusic()
    {
        if (musicFadeRoutine != null)
            StopCoroutine(musicFadeRoutine);
       
        if (defaultMusic != null) defaultMusic.Stop();
        if (chaseMusic != null) chaseMusic.Stop();
        
        // Reset counters
        chasingEnemiesCount = 0;
        isChasing = false;
    }
    
    // Public method to set volumes instantly (useful for settings menu)
    public void SetVolumes(float defaultVol, float chaseVol)
    {
        maxDefaultVolume = Mathf.Clamp01(defaultVol);
        maxChaseVolume = Mathf.Clamp01(chaseVol);
       
        // Apply immediately if not crossfading
        if (musicFadeRoutine == null)
        {
            if (!isChasing && defaultMusic != null)
                defaultMusic.volume = maxDefaultVolume;
            else if (isChasing && chaseMusic != null)
                chaseMusic.volume = maxChaseVolume;
        }
    }
    
    // Debug method to check current state
    public int GetChasingEnemiesCount()
    {
        return chasingEnemiesCount;
    }
}